import mongoose from 'mongoose';
import { config } from "dotenv";
import {MONGODB_URI} from "../utils/config";

config();
export const initDB = async () => {
    try{
        await mongoose.connect(
            MONGODB_URI
        );
    } catch (e) {
        console.log(e);
    }
}
