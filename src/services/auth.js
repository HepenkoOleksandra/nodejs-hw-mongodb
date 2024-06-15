import { User } from "../db/model/user.js";

export const registerUser = async (payload) => {
    const user = await User.create(payload);
    return user;
};
