import createHttpError from "http-errors";
import { Contact } from "../db/model/contact.js";
import { SORT_ORDER } from "../constants/index.js";

const calculatePaginationData = (page, perPage, count) => {
    const totalPages = Math.ceil(count / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
        page,
        perPage,
        totalItems: count,
        totalPages,
        hasNextPage,
        hasPreviousPage,
    };
};

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortBy = '_id',
    sortOrder = SORT_ORDER.ASC,
    filter = {},
}) => {
    const limit = perPage;
    const skip = perPage * (page - 1);

    const contactQuery = Contact.find();

    if (filter.isFavourite) {
        contactQuery.where('isFavourite').equals(filter.isFavourite);
    };

    if (filter.type) {
        contactQuery.where('contactType').equals(filter.type);
    };

    const [contacts, countContacts] = await Promise.all([
        contactQuery.skip(skip).limit(limit).sort({[sortBy]: sortOrder}).exec(),
        Contact.find().merge(contactQuery).countDocuments()]);

    const paginationInformation = calculatePaginationData(page, perPage, countContacts);

    return {
        data: contacts,
        ...paginationInformation,
    };
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
