import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import {searchUsers as searchUsersService} from "../services/user.service.js";

export const getSearchUsers = async (req, res, next) => {
    try {
        const keyword = req.query.search;
        if(!keyword) {
            logger.error("search term not found");
            throw createHttpError.BadRequest("search term not found");
        }
        const users = await searchUsersService(keyword);

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}