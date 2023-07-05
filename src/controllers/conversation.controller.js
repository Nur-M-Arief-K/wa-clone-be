import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import { doesConversationExist, createConversation, populateConversation } from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";

export const postCreateOpenConversation = async (req, res, next) => {
    try {
        const sender_id = req.user.userId;
        const { receiver_id } = req.body;
        if(!receiver_id) {
            logger.error("please provide the receiver user id");
            throw createHttpError.BadRequest("something went wrong");
        }
        const conversationExist = await doesConversationExist(sender_id, receiver_id);

        if(conversationExist) {
            res.json(conversationExist);
        } else {
            let receiver_user = await findUser(receiver_id);
            let conversationData = {
                name: receiver_user.name,
                isGroup: false,
                users: [sender_id, receiver_id]
            };
            const newConversation = await createConversation(conversationData);
            const populatedConversation = await populateConversation(newConversation._id, "users", "-password");
            res.json(populatedConversation);
        }
    } catch (error) {
        next(error);
    }
}