export const notFoundMiddleware = (req, res, next) => {
    // res.status(404).json({
    //     message: 'Not found',
    // });
    res.status(400).send('Not found');
};
