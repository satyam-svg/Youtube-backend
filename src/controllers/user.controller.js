import asynchandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenreferencetoken=async(userId)=>{
    try {
         const user=User.findById(userId);
         const AccessToken=user.generateAccessToken();
         const RefreshToken=user.generateRefreshToken()
 user.RefreshToken = RefreshToken
await  user.save({validateBeforeSave:false});
 return {AccessToken,RefreshToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while genrating aceesstoken and reference token")
    }
}

// Registration of user 
const registerUser = asynchandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("Email:", email);
  // Validation of Users
  if (
    [fullName, email, username, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check whether username or email already exist or not
  const existeduser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existeduser) {
    throw new ApiError(409, "Username or email already exists");
  }

  // Check image paths
  const avtarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath=req.files.coverImage[0].path;
   }
  // Check if avtar file is provided
  if (!avtarLocalPath) {
    throw new ApiError(400, "Avtar file is required");
  }

  const avatar = await uploadoncloudinary(avtarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadoncloudinary(coverImageLocalPath)
    : null;

  // Check if avtar upload failed
  if (!avatar) {
    throw new ApiError(400, "Avtar file upload failed");
  }

  // Entry in Database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user"
    );
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});


const loginuser=asynchandler(async (req,res)=>{
    //req->data=body
    //email or username loge 
    //validate karoge usko ki exist karr raha hai ki nhi
    //password check
    //acess and refresh token 
    //send cokkie
    const {email,username,password}=req.body
    if(!email){
      throw new ApiError(400,"email is required");
    }

    const user=await User.findOne({
      $or:[{email}]
    })
    if(!user){
      throw new ApiError(401,"user does not exist");
    }

    const ispasswordvalidate=await user.isPasswordCorrect(password);
    if(!ispasswordvalidate){
      throw new ApiError(402,"Hey dear you entered a wrong password");
    }

     const {AccessToken,RefreshToken}= await generateAccessTokenreferencetoken(user._id)
     const loggedinUser=await User.findById(user._id).select(
      "-password -refreshToken"
     )

     const options={
        httpOnly:true,
        Secure:true
     }

     res.status(200).
     cookie("AccessToken",AccessToken,options).
     cookie("RefreshToken",RefreshToken,options).
     json(
      new ApiResponse(200,{
        user:loggedinUser,AccessToken,RefreshToken
      },
      "User loggin Suucessfully"
      )
     )
})


const logoutuser=asynchandler(async (req,res)=>{
      
})


export { registerUser,loginuser,logoutuser };
