import { User } from "../db/model/user.js";
import bcrypt from 'bcrypt';

export const registerUser = async (payload) => {
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await User.create({
        ...payload,
        password: hashedPassword,
    });
    return user;
};
