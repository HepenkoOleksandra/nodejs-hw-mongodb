import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from "./constants/index.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
// import { Contact } from "./db/model/contact.js";
import { setupServer } from "./server.js";
import { createDirIfNotExists } from "./utils/createDirIfNotExists.js";

(async () => {
    await initMongoConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    // const contacts = await Contact.find({});
    // console.log(contacts);
    setupServer();
})();

// const bootstrap = async () => {
//     await initMongoConnection();
//     setupServer();
// };

// bootstrap();
