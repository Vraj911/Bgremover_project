import { Webhook } from 'svix';
import userModel from '../models/userModel.js';
import razorpay from 'razorpay';
import transactionModel from '../models/transactionModel.js';
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
const paymentRazorpay = async (req, res) => {
  try {
    const { clerkId, planId } = req.body;
    const userData = await userModel.findOne({ clerkId });

    if (!userData || !planId) {
      return res.status(404).json({ success: false, message: "Invalid Credentials" });
    }

    let credits, plan, amount;
    switch (planId) {
      case 'basic':
        credits = 100;
        plan = 'basic';
        amount = 10;
        break;
      case 'advanced':
        credits = 500;
        plan = 'advanced';
        amount = 50;
        break;
      case 'business':
        credits = 5000;
        plan = 'business';
        amount = 250;
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    const date = new Date();
    const transactionData = {
      clerkId,
      plan,
      amount,
      credits,
      date
    };

    const newTransaction = await transactionModel.create(transactionData);

    const options = {
      amount: amount * 100, // amount in paise
      currency: process.env.CURRENCY || 'INR',
      receipt: `receipt_${newTransaction._id}`,
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error("❌ Error creating Razorpay order:", err);
        return res.status(500).json({ success: false, message: "Failed to create order" });
      }

      res.status(200).json({ success: true, order });
    });

  } catch (error) {
    console.error("❌ Error in paymentRazorpay:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const clerkWebHooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers['svix-id'],
      "svix-timestamp": req.headers['svix-timestamp'],
      "svix-signature": req.headers['svix-signature']
    });

    const { data, type } = req.body;

    switch (type) {
      case 'user.created': {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          photo: data.image_url || '',
          creditsBalance: 0
        };
        await userModel.create(userData);
        return res.status(200).json({ success: true });
      }

      case 'user.updated': {
        const existingUser = await userModel.findOne({ clerkId: data.id }); // ADD THIS LINE
        const userData = {
          email: data.email_addresses[0]?.email_address || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          photo: data.image_url || '',
          creditsBalance: existingUser?.creditsBalance || 0
        };
        await userModel.findOneAndUpdate(
          { clerkId: data.id },
          userData,
          { new: true, upsert: true }
        );
        return res.status(200).json({ success: true });
      }

      case 'user.deleted': {
        await userModel.findOneAndDelete({ clerkId: data.id });
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return res.status(400).json({ success: false, message: "Webhook verification failed" });
  }
};

const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.user;
    const userData = await userModel.findOne({ clerkId });
    res.json({ success: true, credits: userData.creditsBalance });
  } catch (error) {
    console.error("Error in userCredits:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { clerkWebHooks, userCredits,paymentRazorpay };
