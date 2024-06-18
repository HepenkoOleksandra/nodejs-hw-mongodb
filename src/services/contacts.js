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
    userId
}) => {
    const limit = perPage;
    const skip = perPage * (page - 1);

    const contactQuery = Contact.find({userId});

    if (filter.isFavourite) {
        contactQuery.where('isFavourite').equals(filter.isFavourite);
    };

    if (filter.type) {
        contactQuery.where('contactType').equals(filter.type);
    };

    const [contacts, countContacts] = await Promise.all([
        contactQuery.skip(skip).limit(limit).sort({[sortBy]: sortOrder}).exec(),
        Contact.find({userId}).merge(contactQuery).countDocuments()]);

    const paginationInformation = calculatePaginationData(page, perPage, countContacts);

    return {
        data: contacts,
        ...paginationInformation,
    };
};

export const getContactById = async (contactId, userId) => {
    return await Contact.findOne({_id: contactId, userId});
};

export const createContact = async (payload, userId) => {
    const contact = await Contact.create({
        ...payload,
        userId: userId
    });

    return contact;
};

export const upsertContact = async (contactId, userId, payload, options = {}) => {
    const rawResult = await Contact.findOneAndUpdate({_id: contactId, userId}, payload, {
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

export const deleteContact = async (contactId, userId) => {
    const contact = await Contact.findOneAndDelete({
        _id: contactId,
        userId,
    });

    return contact;
};
