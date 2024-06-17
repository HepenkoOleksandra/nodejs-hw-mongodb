import { ONE_DAY } from "../constants/index.js";
import { loginUser, logoutUser, refreshUserSession, registerUser } from "../services/auth.js";

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
        expires: new Date(Date.now() + ONE_DAY),
    });

    res.cookie('sessionToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });

    res.json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {accessToken: session.accessToken},
    });
};

export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
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
        expires: new Date(Date.now() + ONE_DAY),
    });

    res.cookie('sessionToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });

    res.json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {accessToken: session.accessToken},
    });
};
