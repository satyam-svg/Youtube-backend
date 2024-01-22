import asynchandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
//Registration of user
const registerUser = asynchandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("Email:", email);

  //Validation of Users
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //Check weather  username or email already exist or not
  const existeduser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existeduser) {
    throw new ApiError(409, "Username or email alredy exist");
  }

  //Check image path
  const avtarlocalpath=req.files?.avtar[0]?.path;
  const coverImagelocalpath=req.files?.coverImage[0]?.path;

  if(!avtarlocalpath){
    throw new ApiError(400,"Avtar file is required");
  }

  const avtar=await uploadoncloudinary(avtarlocalpath)
  const coverImage=await uploadoncloudinary(coverImagelocalpath)
 
  if(!avtar){
   throw new ApiError(400,"Avtar file is required");
  }
 
  //Entry in Database
  const user=await User.create({
   fullName,
   avtar:avtar.url,
   coverImage:coverImage?.url || "",
   email,
   password,
   username:username.toLowerCase()
  })
  const createduser=await  User.findById(user._id).select(
    "-password -refreshToken"
  )
  if(!createduser){
    throw new ApiError(500,"Something went wrong wjile registering the user");
  }

  return res.status(201).json(
    new ApiResponse(200,createduser,"User registered successfully")
  )
});

//upload on cloudinary

export { registerUser };
