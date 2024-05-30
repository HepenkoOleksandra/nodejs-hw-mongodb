import dotenv from 'dotenv';

dotenv.config();

export const env = (envName, defaultValue) => {
    const value = process.env[envName];

    if (value) return value;
    
    if (defaultValue) return defaultValue;

    return new Error(`Env var with name ${envName} is not found`);
};
