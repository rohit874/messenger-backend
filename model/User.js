import mongoose from "mongoose";
import { APP_URL } from "../config";
const UserSchema = new mongoose.Schema(
    {
        name: {type:String, required:true},
        email: {type:String, required:true, unique:true},
        image: {type:String, required:true, get: (image) =>{
          return `${APP_URL}/${image}`;
      } },
        password: {type:String, required:true},
    },
    { timestamps: true, toJSON: { getters:true } }
  );

export default mongoose.model('User', UserSchema);