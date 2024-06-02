import { Router } from "express";
// import { getAllContacts, getContactById } from "../services/contacts.js";
import { getContactByIdController, getContactsController } from "../controllers/contacts.js";

const contactsRouter = Router();

contactsRouter.get('/contacts', getContactsController);

contactsRouter.get('/contacts/:contactId', getContactByIdController);

export default contactsRouter;
