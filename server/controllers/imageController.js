import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import userModel from '../models/userModel.js';
const removeBgImage = async (req, res) => {
  try {
    const { clerkId } = req.user;
    const user = await userModel.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.creditsBalance <= 0) {
      return res.status(403).json({ success: false, message: "Insufficient credits" });
    }
    const imagePath = req.file.path;
    const imageFile = fs.createReadStream(imagePath);
    const formData = new FormData();
    formData.append('image_file', imageFile);
    const clipdropRes = await axios.post(
      'https://clipdrop-api.co/remove-background/v1',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': process.env.CLIP_DROP_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );
    const base64Image = Buffer.from(clipdropRes.data, 'binary').toString('base64');
    const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;
    const updatedUser = await userModel.findOneAndUpdate(
      { clerkId },
      { creditsBalance: user.creditsBalance - 1 },
      { new: true }
    );
    res.json({
      success: true,
      resultImage,
      creditsBalance: updatedUser.creditsBalance,
      message: "Background removed successfully",
    });

  } catch (error) {
    console.error("❌ removeBgImage error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { removeBgImage };
