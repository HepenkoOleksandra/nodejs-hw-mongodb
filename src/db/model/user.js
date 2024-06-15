import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true, },
    email: {type: String, required: false, },
    password: {type: String, required: true, unique: true }
}, {
    timestamps: true,
    versionKey: false,
});

export const User = model('users', userSchema);
