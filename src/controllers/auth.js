import { THIRTY_DAY } from "../constants/index.js";
import { loginUser, logoutUser, refreshUserSession, registerUser, resetPassword, sendResetEmail } from "../services/auth.js";
import { generateOAuthUrl } from "../utils/googleOAuth.js";

export const registerUserController = async (req, res) => {
    const user = await registerUser(req.body);

    res.json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAY),
    });

    res.cookie('sessionToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAY),
    });

    res.json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {accessToken: session.accessToken},
    });
};

export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId && req.cookies.sessionToken) {
        await logoutUser({
            sessionId: req.cookies.sessionId,
            sessionToken: req.cookies.sessionToken
        });
    }

    res.clearCookie('sessionId');
    res.clearCookie('sessionToken');

    res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {
    const session = await refreshUserSession({
        sessionId: req.cookies.sessionId,
        sessionToken: req.cookies.sessionToken
    });

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAY),
    });

    res.cookie('sessionToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAY),
    });

    res.json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {accessToken: session.accessToken},
    });
};

export const sendResetEmailController = async (req, res) => {
    await sendResetEmail(req.body.email);

    res.json({
        status: 200,
        message: "Reset password email has been successfully sent.",
        data: {}
    });
};

export const resetPasswordController = async (req, res) => {
    const token = req.body.token;
    const password = req.body.password;
    await resetPassword(token, password);

    res.json({
        status: 200,
        message: "Password has been successfully reset!",
        data: {}
    });
};

export const generateOAuthUrlController = async (req, res) => {
    const url = generateOAuthUrl();

    res.json({
        status: 200,
        message: "Successfully get Google OAuth url!",
        data: {
            url,
        }
    });
};
