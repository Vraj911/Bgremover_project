import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import userModel from '../models/userModel.js';
const removeBgImage=async (req, res) => {
    try {
        const {clerkId} = req.user;
        const user = await userModel.findOne({ clerkId });
        if(!user) {
            return res.json({success:false,message:"User not found"});
        }   
        if(user.creditsBalance <= 0) {
            return res.json({success:false,message:"Insufficient credits"});
        }
        const imagePath = req.file.path;
        const imageFile=fs.createReadStream(imagePath);
        const formData = new FormData();
        formData.append('image_file', imageFile);
        const {data}=await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'X-Api-Key': process.env.CLIP_DROP_API_KEY
            },
            responseType: 'arraybuffer'
        });
        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:${req.file.mimetype}:base64,${base64Image}`;
        await userModel.findOneAndUpdate(clerkId, {creditsBalance: user.creditsBalance - 1}, {new: true});
        res.json({success:true, resultImage,creditsBalance: user.creditsBalance - 1,message:"Background removed successfully"});    
    } catch (error) {
        console.log(error.message)
    res.json({success:false,message:error.message})
    }
}
export { removeBgImage };