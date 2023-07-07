import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import { doesConversationExist, createConversation, populateConversation, getUserConversations } from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";

export const postCreateOpenConversation = async (req, res, next) => {
    try {
        const senderId = req.user.userId;
        const { receiverId } = req.body;
        if(!receiverId) {
            logger.error("please provide the receiver user id");
            throw createHttpError.BadRequest("something went wrong");
        }
        const conversationExist = await doesConversationExist(senderId, receiverId);

        if(conversationExist) {
            res.json(conversationExist);
        } else {
            let receiver_user = await findUser(receiverId);
            let conversationData = {
                name: receiver_user.name,
                picture: receiver_user.picture,
                isGroup: false,
                users: [senderId, receiverId]
            };
            const newConversation = await createConversation(conversationData);
            const populatedConversation = await populateConversation(newConversation._id, "users", "-password");
            res.json(populatedConversation);
        }
    } catch (error) {
        next(error);
    }
}

export const getConversations = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const conversations = await getUserConversations(user_id);
        res.status(200).json(conversations);
    } catch (error) {
        
    }
}