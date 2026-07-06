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
    type: {
        type: String,
        enum: ["code", "doc"],
        default: "code",
    },
    code: {
        type: String,
    },
    // Serialized Yjs document (base64) — the CRDT source of truth.
    // `code` stays as the derived plain text/HTML for previews and exports.
    yjsState: {
        type: String,
    },
    // Judge0 language id — only meaningful for "code" rooms
    // (requiredness is enforced by the Zod schema, not the model)
    language: {
        type: Number,
    },
    joinedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
});

export const Room = mongoose.model("Room", roomSchema);
