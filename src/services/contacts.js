import createHttpError from "http-errors";
import { Contact } from "../db/model/contact.js";
import { ENV_VARS, SORT_ORDER } from "../constants/index.js";
// import { saveFile } from "../utils/saveFile.js";
import { env } from "../utils/env.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";

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

export const createContact = async ({photo, ...payload}, userId) => {
    // const photoUrl = await saveFile(photo);

    if (!photo) return;

    let photoUrl;

    if (photo) {
        if (env(ENV_VARS.ENABLE_CLOUDINARY) === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }

    const contact = await Contact.create({
        ...payload,
        userId: userId,
        photo: photoUrl,
    });

    return contact;
};

export const upsertContact = async (contactId, userId, {photo, ...payload}, options = {}) => {
    // const photoUrl = await saveFile(photo);
    if (!photo) return;

    let photoUrl;

    if (photo) {
        if (env(ENV_VARS.ENABLE_CLOUDINARY) === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }

    const rawResult = await Contact.findOneAndUpdate({ _id: contactId, userId }, {...payload, photo: photoUrl}, {
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
