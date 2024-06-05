export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        message: 'Route not found',
    });
    // res.status(400).send('Not found');
};
