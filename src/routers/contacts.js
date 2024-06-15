import { Router } from "express";
// import { getAllContacts, getContactById } from "../services/contacts.js";
import { createContactController, deleteContactByIdController, getContactByIdController, getContactsController, patchContactByIdController, putContactByIdController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateMongoId } from "../middlewares/validateMongoId.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema } from "../validation/createContactSchema.js";
import { updateContactSchema } from "../validation/updateContactSchema.js";

const contactsRouter = Router();

// contactsRouter.use('/:contactId', validateMongoId('contactId'));

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', validateMongoId('contactId'), ctrlWrapper(getContactByIdController));

contactsRouter.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));

contactsRouter.patch('/:contactId', validateBody(updateContactSchema), validateMongoId('contactId'), ctrlWrapper(patchContactByIdController));

contactsRouter.put('/:contactId', validateBody(createContactSchema), validateMongoId('contactId'), ctrlWrapper(putContactByIdController));

contactsRouter.delete('/:contactId', validateMongoId('contactId'), ctrlWrapper(deleteContactByIdController));

export default contactsRouter;
