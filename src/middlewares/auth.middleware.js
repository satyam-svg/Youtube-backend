import { ApiError } from "../utils/ApiError";
import asynchandler from "../utils/asynchandler"
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model";


const verifyJWT=asynchandler(async (req,res,next)=>{
    try {
         const token=req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ","");
    
         if(!token){
            throw new ApiError(401,"Unauthorized request");
         }
         const decodetoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
         const user=await User.findById(decodetoken?._id).
         select("-password -refreshToken")
    
         if(!user){
            throw new ApiError(401,"Invalid Access token")
         }
    
         req.user = user
         next()
    } catch (error) {
          throw new ApiError(401,error?.message,"Invalid access token")
    }
})


export default verifyJWT;