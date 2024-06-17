import createHttpError from "http-errors";
import { User } from "../db/model/user.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Session } from "../db/model/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";

export const registerUser = async (payload) => {
    const isUser = await User.findOne({ email: payload.email });
    if (isUser) {
        throw createHttpError(409, 'Email is use');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await User.create({
        ...payload,
        password: hashedPassword,
    });
    return user;
};

export const loginUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const passwordIsEqual = await bcrypt.compare(payload.password, user.password);
    if (!passwordIsEqual) {
         throw createHttpError(401, 'Unauthorized');
    }

    await Session.deleteOne({userId: user._id});

    const accessToken = crypto.randomBytes(30).toString('base64');
    const refreshToken = crypto.randomBytes(30).toString('base64');

    const session = await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY)
    });

    return session;
};

export const logoutUser = async ({sessionId, sessionToken}) => {
    await Session.deleteOne({_id: sessionId,  refreshToken: sessionToken});
};

export const refreshUserSession = async ({ sessionId, sessionToken }) => {
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken: sessionToken,
    });

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    const isSessionTokenExpired = new Date > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }

    await Session.deleteOne({_id: sessionId,  refreshToken: sessionToken});

    const accessToken = crypto.randomBytes(30).toString('base64');
    const refreshToken = crypto.randomBytes(30).toString('base64');

    const newSession = await Session.create({
        userId: session.userId,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY)
    });

    return newSession;
};
