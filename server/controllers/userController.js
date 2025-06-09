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
          photo: data.image_url || ''
        };
        await userModel.create(userData);
        return res.status(200).json({ success: true });
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0]?.email_address || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          photo: data.image_url || ''
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
        return res.status(200).json({ success: true }); // For unhandled events
    }
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return res.status(400).json({ success: false, message: "Webhook verification failed" });
  }
};

export { clerkWebHooks };
