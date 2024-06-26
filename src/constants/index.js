import path from 'node:path';

export const ENV_VARS = {
    PORT: "PORT",
    MONGODB_USER: "MONGODB_USER",
    MONGODB_PASSWORD: "MONGODB_PASSWORD",
    MONGODB_URL: "MONGODB_URL",
    MONGODB_DB: "MONGODB_DB",
    SMTP_HOST: "SMTP_HOST",
    SMTP_PORT: "SMTP_PORT",
    SMTP_USER: "SMTP_USER",
    SMTP_PASSWORD: "SMTP_PASSWORD",
    SMTP_FROM: "SMTP_FROM",
    JWT_SECRET: "JWT_SECRET",
    APP_DOMAIN: "APP_DOMAIN",
    CLOUD_NAME: "CLOUD_NAME",
    API_KEY: "API_KEY",
    API_SECRET: "API_SECRET",
    ENABLE_CLOUDINARY: "ENABLE_CLOUDINARY",
    GOOGLE_AUTH_CLIENT_ID: "GOOGLE_AUTH_CLIENT_ID",
    GOOGLE_AUTH_CLIENT_SECRET: "GOOGLE_AUTH_CLIENT_SECRET",
};

export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
};

export const THIRTY_DAY = 1000 * 60 * 60 * 24 * 30;

export const FIFTEEN_MINUTES = 1000 * 60 * 15;

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
