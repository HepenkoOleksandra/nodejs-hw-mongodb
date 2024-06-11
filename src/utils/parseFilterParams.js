const parseContactType = (type) => {
    const isString = typeof type === 'string';

    if (!isString) return;

    const isContactType = ['work', 'home', 'personal'].includes(type);

    if (!isContactType) return;

    return type;
};

const parseBoolean = (bool) => {
    const isString = typeof bool === 'string';

    if (!isString) return;

    const isBoolean = ['false', 'true'].includes(bool);

    if (!isBoolean) return;

    return bool === 'true' ? true : false;
};

export const parseFilterParams = (query) => {
    const { isFavourite, type } = query;

    const parsedIsFavourite = parseBoolean(isFavourite);
    const parsedContactType = parseContactType(type);

    return {
        isFavourite: parsedIsFavourite,
        type: parsedContactType,
    };
};
