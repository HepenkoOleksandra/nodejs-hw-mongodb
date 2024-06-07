import { isHttpError } from "http-errors";

export const errorHandler = (error, req, res, next) => {
    // if (error instanceof HttpError) {
    if(isHttpError(error)) {
        res.status(error.status).json({
            status: error.status,
            message: error.message,
            data: {
                message: error.message,
            },
            errors: error.errors || [],
        });
        return;
     };

    res.status(500).json({
        status: 500,
        message: 'Something went wrong',
        data: {
            message: error.message,
        }
    });
};

