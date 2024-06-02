import { getAllContacts, getContactById } from "../services/contacts.js";


export const getContactsController = async (req, res) => {
    const contacts = await getAllContacts();
    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};

export const getContactByIdController = async (req, res) => {
    const id = req.params.contactId;
    const contact = await getContactById(id);

    if (!contact) {
        return res.status(400).json({
            status: 400,
            message: `Contact with id ${id} not found!`,
        });
    };

    res.json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data: contact,
    });
};


