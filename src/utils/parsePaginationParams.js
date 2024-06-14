const parseNumber = (number, defaultNumber) => {
    if (typeof number !== 'string') return defaultNumber;

    const parsedNumber = parseInt(number);
    if (Number.isNaN(parsedNumber)) return defaultNumber;

    if (parsedNumber <= 0) return defaultNumber;

    return parsedNumber;
};

export const parsePaginationParams = (query) => {
    const page = query.page;
    const perPage = query.perPage;

    const parsedPage = parseNumber(page, 1);
    const parsedPerPage = parseNumber(perPage, 10);

    return {
        page: parsedPage,
        perPage: parsedPerPage,
    };
};
