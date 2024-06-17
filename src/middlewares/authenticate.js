import createHttpError from "http-errors";
import { Session } from "../db/model/session.js";
import { User } from "../db/model/user.js";

export const authenticate = async (req, res, next) => {
    const header = req.get('Authorization');

    if (!header) {
        next(createHttpError(401, 'The authorization header is not provided'));
        return;
    }

    const [bearer, token] = header.split(' ');

    if (bearer !== 'Bearer' || !token) {
        next(createHttpError(401, 'The authorization header must be of the Bearer type'));
        return;
    }

    const session = await Session.findOne({ accessToken: token });

    if (!session) {
        next(createHttpError(401, 'Session not found'));
        return;
    }

    const isSessionTokenExpired = new Date > session.accessTokenValidUntil;

    if (isSessionTokenExpired) {
        next(createHttpError(401, 'Access token is expired'));
        return;
    }

    const user = await User.findById(session.userId);

    if (!user) {
        next(createHttpError(401, 'User associated with this session not found'));
        return;
    }

    req.user = user;

    return next();
};
