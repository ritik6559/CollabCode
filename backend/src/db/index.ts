import mongoose from 'mongoose';
import { MONGODB_URI } from "../utils/config";

export const initDB = async () => {
    await mongoose.connect(MONGODB_URI);
};
