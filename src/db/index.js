import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB= async ()=>{
     try {
         const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
         console.log(`Mongoose connected successfuly at host ${connectioninstance.connection.host}`)
     } catch (error) {
           console.error("Unable to connect with database",error);
           process.exit(1);
     }
}
export default connectDB