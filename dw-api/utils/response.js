/**
 * Custom 404 Error Class
 */
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

function success(res, message, data = {}, code = 200) {
    res.status(code).json({
        status: true,
        message,
        data
    });
}

function failure(res, error) {
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => e.message);
        return res.status(400).json({
            status: false,
            message: 'Request parameter error',
            errors
        });
    }

    if (error.name === 'NotFoundError') {
        return res.status(404).json({
            status: false,
            message: 'Resource does not exist',
            errors: [error.message]
        });
    }

    res.status(500).json({
        status: false,
        message: 'Server Error',
        errors: [error.message]
    });
}


module.exports = {
    NotFoundError,
    success,
    failure,
}
