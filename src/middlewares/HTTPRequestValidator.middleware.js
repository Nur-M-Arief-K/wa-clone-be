import createHttpError from 'http-errors';
import logger from '../configs/logger.config.js';
import validationResult from '../utils/express-validator/validation-result.js';

const HTTPRequestValidator = (req, res, next) => {
    try {
        const validationErrors = validationResult(req).array();
    
        // if any errors exists throw error
        if (validationErrors.length > 0) {
            logger.error(validationErrors);
            throw createHttpError.BadRequest(validationErrors);
        }

        // if no error exists continue to next middleware
        next();
    } catch (error) {
        next(error)
    }
}

export default HTTPRequestValidator;