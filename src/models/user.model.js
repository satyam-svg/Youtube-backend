import mongoose ,{Schema} from 'mongoose';
import { Jwt } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const userSchema= new Schema(
    {
       username:{
        type:String,
        required:true,
        lowercase:true,
        index:true,
        trim:true
       },
       email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
       },
       fullName:{
        type:String,
        required:true,
        index:true,
        trim:true
       },
       avtar:{
        type:String,
       },
       coverImage:{
        type:String,
       },
       watchHistory:[
        {
            type:Schema.types.ObjectId,
            ref:"Video"
        }
       ],
       password:{
        type:String,
        required:true,
       },
       refreshToken:{
        type:String,
       },

    },
{timestamps:true}
)
  userSchema.pre("save", async function (next){
      if(!this.isModified("password")) return next();
       this.password=bcrypt.hash(this.password,10)
       next();
  })
  userSchema.methods.isPasswordCorrect=async function(password){
       return await bcrypt.compare(password,this.password)
  }
  userSchema.methods.generateaccesstoken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
  }
  userSchema.methods.refreshToken=function(){
    return jwt.sign(
        {
            _id:this._id, 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
  }
export const User=mongoose.model('User',userSchema)