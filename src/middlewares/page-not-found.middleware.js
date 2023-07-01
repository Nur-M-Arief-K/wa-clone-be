import createHttpError from "http-errors";

const pageNotFound = async (req, res, next) => {
    next(createHttpError.NotFound("page not found"))
}

export default pageNotFound;