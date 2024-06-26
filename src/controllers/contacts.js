import { createContact, deleteContact, getAllContacts, getContactById, upsertContact } from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { env } from "../utils/env.js";
import { ENV_VARS } from "../constants/index.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const getContactsController = async (req, res,) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id;
    const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, filter, userId });

    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};

export const getContactByIdController = async (req, res, next) => {
    const contactId = req.params.contactId;
    const userId = req.user._id;
    const contact = await getContactById(contactId, userId);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    };

    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

export const createContactController = async (req, res) => {
    const userId = req.user._id;
    const body = req.body;
    const contact = await createContact(body, userId);

    res.status(201).json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
};

export const patchContactByIdController = async (req, res, next) => {
    const contactId = req.params.contactId;
    const userId = req.user._id;
    const photo = req.file;
    const body = req.body;
    // const { body, photo } = req;

    let photoUrl;

    if (photo) {
        if (env(ENV_VARS.ENABLE_CLOUDINARY) === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
      }
    }
    const {contact} = await upsertContact(contactId, userId, {...body, photo: photoUrl,});

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
    const contactId = req.params.contactId;
    const body = req.body;
    const userId = req.user._id;
    const {isNew, contact} = await upsertContact(contactId, userId, body, {upsert: true});

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
    const contactId = req.params.contactId;
    const userId = req.user._id;
    const contact = await deleteContact(contactId, userId);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    };

    res.status(204).send();
};


