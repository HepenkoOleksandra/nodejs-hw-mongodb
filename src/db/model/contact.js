import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: { type: String, required: true, },
    phoneNumber: { type: String, required: true, },
    email: {type: String, required: false, },
    isFavourite: { type: Boolean, default: false, },
    contactType: { type: String, required: true, default: 'personal', enum: ['work', 'home', 'personal'], },
    userId: { type: Schema.Types.ObjectId, ref: 'users', },
    photo: {type: String,},
}, {
    timestamps: true,
    versionKey: false,
});

export const Contact = model('contacts', contactSchema);
