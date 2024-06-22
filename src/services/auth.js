import createHttpError from "http-errors";
import jwt from 'jsonwebtoken';
import { User } from "../db/model/user.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Session } from "../db/model/session.js";
import { ENV_VARS, FIFTEEN_MINUTES, THIRTY_DAY } from "../constants/index.js";
import { env } from "../utils/env.js";
import { sendMail } from "../utils/sendMail.js";

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
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY)
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

    const isSessionTokenExpired = new Date > session.refreshTokenValidUntil;

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
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY)
    });

    return newSession;
};

export const sendResetEmail = async(email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw createHttpError(404, "User not found!");
    }

    const resetToken = jwt.sign(
        {
            sub: user._id,
            email,
        },
        env(ENV_VARS.JWT_SECRET),
        { expiresIn: '5m', },
    );

    await sendMail({
        html: `<h1>Hello ${user.name}</h1>
        <p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
        to: email,
        subject: "Reset your password",
        from: env(ENV_VARS.SMTP_FROM),
    });
};


