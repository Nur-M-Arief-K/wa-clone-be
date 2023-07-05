import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import { doesConversationExist, createConversation, populateConversation, getUserConversations } from "../services/conversation.service.js";
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
            console.log("conversation exist branch run")
            res.json(conversationExist);
        } else {
            console.log("conversation NOT exist branch run")
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

export const getConversations = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const conversations = await getUserConversations(user_id);
        res.status(200).json(conversations);
    } catch (error) {
        
    }
}