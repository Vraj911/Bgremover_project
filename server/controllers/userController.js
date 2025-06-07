import {Webhook} from 'svix';
import User from '../models/User.js';  
const clerkWebHooks=async(req,res)=>{
     try {
        const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers['svix-id'],
            "svix-timestamp":req.headers['svix-timestamp'],
            "svix-signature":req.headers['svix-signature']
        })
        const {data,type}=req.body;
        switch(type){
            case 'user.created':{
                const userData = {
                    clerkid: data.id,
                    email: data.email_addresses[0]?.email_address || '',
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    photo: data.iamge_url || '' 
                }
                await User.create(userData); 
                res.JSON({})
                break;
            }
              case 'user.updated':{
                const userData = {
                    email: data.email_addresses[0]?.email_address || '',
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    photo: data.iamge_url || '' 
                }
                await User.findOneAndUpdate(
                    { clerkId: data.id },
                    userData,
                    { new: true, upsert: true }
                );
                res.JSON({})
                break;
            }
              case 'user.deleted':{
                await User.findOneAndDelete({ clerkId: data.id });
                res.JSON({})    
                break;
            }
            default:{
                break;
            }
        }
     } catch (error) {
        console.error("Webhook verification failed:", error); 
        res.JSON({success:false,message:"Webhook verification failed"}); 
     }
}
export {clerkWebHooks}