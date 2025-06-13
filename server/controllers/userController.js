import { Webhook } from 'svix';
import userModel from '../models/userModel.js';

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
    res.json({success: true, credits: userData.creditsBalance});
  } catch (error) {
    console.error("Error in userCredits:", error); 
  }
}
export { clerkWebHooks,userCredits };
