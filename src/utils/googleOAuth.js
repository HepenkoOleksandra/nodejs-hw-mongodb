import path from "node:path";
// import { readFile } from 'fs/promises';
import fs from "node:fs";
import { OAuth2Client } from "google-auth-library";
import { env } from "./env.js";
import { ENV_VARS } from "../constants/index.js";

// const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

const oauthConfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'google-oauth.json')).toString(),
);

const googleOAuthClient = new OAuth2Client({
    clientId: env(ENV_VARS.GOOGLE_AUTH_CLIENT_ID),
    clientSecret: env(ENV_VARS.GOOGLE_AUTH_CLIENT_SECRET),
    redirectUri: oauthConfig.web.redirect_uris[0],
});

export const generateOAuthUrl = () => {
    return googleOAuthClient.generateAuthUrl({
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"
        ]
    });
};
