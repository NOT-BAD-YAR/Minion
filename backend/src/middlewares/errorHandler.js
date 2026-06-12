const logger = require('../utils/logger');

/**
 * Centralized error handling middleware.
 * Logs the error securely and returns a structured JSON response.
 * 
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
    logger.error(`Error processing request: ${req.method} ${req.url}`, {
        message: err.message,
        stack: err.stack
    });

    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
