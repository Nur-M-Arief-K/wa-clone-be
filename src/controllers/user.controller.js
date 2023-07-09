import {searchUsers as searchUsersService} from "../services/user.service.js";

export const getSearchUsers = async (req, res, next) => {
    try {
        // Extract query search and searcher user ID, pass it to searchUsersService, return users list that has been found
        const keyword = req.query.search;
        const searcherUserId = req.user.userId;
        const foundUsers = await searchUsersService(keyword, searcherUserId);
        res.status(200).json(foundUsers);
    } catch (error) {
        next(error);
    }
}