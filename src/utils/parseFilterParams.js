const parseContactType = (contactType, defaultValue) => {
    const isString = typeof contactType === 'string';

    if (!isString) return defaultValue;

    const isContactType = ['work', 'home', 'personal'].includes(contactType);

    if (!isContactType) return defaultValue;

    return isContactType;
};

const
