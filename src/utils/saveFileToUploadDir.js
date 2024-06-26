import fs from 'node:fs/promises';
import path from 'node:path';
import { ENV_VARS, TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

export const saveFileToUploadDir = async (file) => {
    await fs.rename(path.join(TEMP_UPLOAD_DIR, file.filename), path.join(UPLOAD_DIR, file.filename));

    // const content = await fs.readFile(file.path);
    // const newPath = path.join(UPLOAD_DIR, file.filename);
    // await fs.writeFile(newPath, content);
    // await fs.unlink(file.path);

    return `${env(ENV_VARS.APP_DOMAIN)}/uploads/${file.filename}`;
};
