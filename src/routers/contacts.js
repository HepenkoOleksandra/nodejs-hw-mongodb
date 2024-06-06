import { Router } from "express";
// import { getAllContacts, getContactById } from "../services/contacts.js";
import { createContactController, deleteContactByIdController, getContactByIdController, getContactsController, patchContactByIdController, putContactByIdController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateMongoId } from "../middlewares/validateMongoId.js";

const contactsRouter = Router();

// contactsRouter.use('/contacts/:contactId', validateMongoId('contactId'));

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get('/contacts/:contactId', validateMongoId('contactId'), ctrlWrapper(getContactByIdController));

contactsRouter.post('/contacts', ctrlWrapper(createContactController));

contactsRouter.patch('/contacts/:contactId', validateMongoId('contactId'), ctrlWrapper(patchContactByIdController));

contactsRouter.put('/contacts/:contactId', validateMongoId('contactId'), ctrlWrapper(putContactByIdController));

contactsRouter.delete('/contacts/:contactId', validateMongoId('contactId'), ctrlWrapper(deleteContactByIdController));

export default contactsRouter;
