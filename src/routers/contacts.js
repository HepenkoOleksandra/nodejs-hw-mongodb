import { Router } from "express";
// import { getAllContacts, getContactById } from "../services/contacts.js";
import { createContactController, deleteContactByIdController, getContactByIdController, getContactsController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

contactsRouter.post('/contacts', ctrlWrapper(createContactController));

contactsRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactByIdController));

export default contactsRouter;
