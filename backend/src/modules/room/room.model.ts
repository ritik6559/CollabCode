import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    code: {
        type: String,
    },
    language: {
        type: Number,
        required: true,
    },
    joinedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
});

export const Room = mongoose.model("Room", roomSchema);
