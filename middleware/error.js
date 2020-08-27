const ErrorResponse = require("../utils/errorResonse");

const errorHandler = (err, req, res, next) => {
    let error = {...err };

    error.message = err.message;

    //Log to console for dev
    console.log(err.stack);

    //mongoose bad object ID
    if (err.name === "CastError") {
        const message = `resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    //mongoose duplicate key
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 400);
    }

    //mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((value) => value.message);

        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server error",
    });
};

module.exports = errorHandler;