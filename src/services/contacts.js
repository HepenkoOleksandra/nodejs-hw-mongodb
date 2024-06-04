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

export const deleteContact = async (id) => {
    await Contact.findOneAndDelete({
        _id: id,
    });
};
