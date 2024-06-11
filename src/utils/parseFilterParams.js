const parseContactType = (contactType) => {
    const isString = typeof contactType === 'string';

    if (!isString) return;

    const isContactType = ['work', 'home', 'personal'].includes(contactType);

    if (!isContactType) return;

    return contactType;
};

const parseBoolean = (bool) => {
    const isString = typeof bool === 'string';

    if (!isString) return;

    const isBoolean = ['false', 'true'].includes(bool);

    if (!isBoolean) return;

    return bool === 'true' ? true : false;
};

export const parseFilterParams = (query) => {
    const { isFavourite, contactType } = query;

    const parsedIsFavourite = parseBoolean(isFavourite);
    const parsedContactType = parseContactType(contactType);

    return {
        isFavourite: parsedIsFavourite,
        contactType: parsedContactType,
    };
};
