import { createContact, deleteContact, getAllContacts, getContactById, upsertContact } from "../services/contacts.js";
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

export const createContactController = async (req, res) => {
    const body = req.body;
    const contact = await createContact(body);

    res.status(201).json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
};

export const patchContactByIdController = async (req, res, next) => {
    const id = req.params.contactId;
    const body = req.body;
    const {contact} = await upsertContact(id, body);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    };

    res.status(200).json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: contact,
    });
};

export const putContactByIdController = async (req, res, next) => {
    const id = req.params.contactId;
    const body = req.body;
    const {isNew, contact} = await upsertContact(id, body, {upsert: true});

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    };

    const status = isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: `Successfully upserted a contact!`,
        data: contact,
    });
};

export const deleteContactByIdController = async (req, res, next) => {
    const id = req.params.contactId;
    const contact = await deleteContact(id);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    };

    res.status(204).send();
};


