import createHttpError from "http-errors";
import { Contact } from "../db/model/contact.js";

export const getAllContacts = async () => {
    return await Contact.find({});
};

export const getContactById = async (id) => {
    return await Contact.findById(id);
};

export const createContact = async (payload) => {
    const contact = await Contact.create(payload);
    return contact;
};

export const upsertContact = async (id, payload, options = {}) => {
    const rawResult = await Contact.findByIdAndUpdate(id, payload, {
        new: true,
        includeResultMetadata: true,
        ...options
    });

    if (!rawResult || !rawResult.value) {
        throw createHttpError(404, 'Contact not found');
        // return null;
    };

    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};

export const deleteContact = async (id) => {
    const contact = await Contact.findByIdAndDelete(id);

    return contact;
};
