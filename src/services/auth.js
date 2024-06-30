import createHttpError from "http-errors";
import jwt from 'jsonwebtoken';
import { User } from "../db/model/user.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Session } from "../db/model/session.js";
import { ENV_VARS, FIFTEEN_MINUTES, TEMPLATES_DIR, THIRTY_DAY } from "../constants/index.js";
import { env } from "../utils/env.js";
import { sendMail } from "../utils/sendMail.js";
import path from "node:path";
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import { getFullNameFromGoogleTokenPayload, validateCode } from "../utils/googleOAuth.js";

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

    const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, 'sendResetEmail.html',);

    const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);

    const html = template({
        name: user.name,
        link: `${env(ENV_VARS.APP_DOMAIN)}/auth/reset-password?token=${resetToken}`,
    });

    try {
         await sendMail({
        html,
        to: email,
        subject: "Reset your password",
        from: env(ENV_VARS.SMTP_FROM),
    });
    } catch (error) {
        console.log(error);
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }

};

export const resetPassword = async (token, password) => {
    let tokenPayload;

    try {
       tokenPayload = jwt.verify(token, env(ENV_VARS.JWT_SECRET));
    } catch (error) {
        console.log(error.message);
        throw createHttpError(401, "Token is expired or invalid.");
    }

    const user = await User.findOne({
        _id: tokenPayload.sub,
        email: tokenPayload.email,
    });

    if (!user) {
        throw createHttpError(404, "User not found");
    }

    await Session.deleteOne({userId: user._id});

    const hashPassword = await bcrypt.hash(password, 10);

    await User.updateOne({ _id: user._id }, { password: hashPassword });
};

export const loginOrSignupWithGoogle = async (code) => {
    const payload = await validateCode(code);

    if (!payload) throw createHttpError(401);

    let user = await User.findOne({ email: payload.email });

    if (!user) {
        const password = await bcrypt.hash(crypto.randomBytes(30).toString('base64'), 10);

        user = await User.create({
            name: getFullNameFromGoogleTokenPayload(payload),
            email: payload.email,
            password,
        });
    }

    await Session.deleteOne({userId: user._id});

    const accessToken = crypto.randomBytes(30).toString('base64');
    const refreshToken = crypto.randomBytes(30).toString('base64');

    const newSession = await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY)
    });

    return newSession;

};

