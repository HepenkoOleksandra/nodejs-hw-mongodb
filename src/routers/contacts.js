import { Router } from "express";
// import { getAllContacts, getContactById } from "../services/contacts.js";
import { createContactController, deleteContactByIdController, getContactByIdController, getContactsController, patchContactByIdController, putContactByIdController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateMongoId } from "../middlewares/validateMongoId.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";

const contactsRouter = Router();

// contactsRouter.use('/contacts/:contactId', validateMongoId('contactId'));

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get('/contacts/:contactId', validateMongoId('contactId'), ctrlWrapper(getContactByIdController));

contactsRouter.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactController));

contactsRouter.patch('/contacts/:contactId', validateBody(updateContactSchema), validateMongoId('contactId'), ctrlWrapper(patchContactByIdController));

contactsRouter.put('/contacts/:contactId', validateBody(createContactSchema), validateMongoId('contactId'), ctrlWrapper(putContactByIdController));

contactsRouter.delete('/contacts/:contactId', validateMongoId('contactId'), ctrlWrapper(deleteContactByIdController));

export default contactsRouter;
