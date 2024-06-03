import { createContact, getAllContacts, getContactById } from "../services/contacts.js";
import createHttpError from "http-errors";

export const getContactsController = async (req, res) => {
    const contacts = await getAllContacts();
    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};

export const getContactByIdController = async (req, res, next) => {
    const id = req.params.contactId;
    const contact = await getContactById(id);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    };

    res.json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data: contact,
    });
};

export const createContactController = async (req, res, next) => {
    const body = req.body;
    const contact = await createContact(body);

    res.status(201).json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
};


