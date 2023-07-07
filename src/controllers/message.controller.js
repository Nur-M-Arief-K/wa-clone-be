import logger from "../configs/logger.config.js";
import { createMessage, populateMessage, updateLatestMessage, getConversationMessages } from "../services/message.service.js";

export const postMessage = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { message, conversationId, files } = req.body;
        if (!conversationId || (!message && !files)) {
            logger.error("Invalid post message request");
            return res.sendStatus(400);
        }
        const msgData = {
            sender: userId,
            message,
            conversation: conversationId,
            files: files || []
        };
        let newMessage = await createMessage(msgData);
        let populatedMessage = await populateMessage(newMessage._id);
        await updateLatestMessage(conversationId, newMessage);
        res.json(populatedMessage);
    } catch (error) {
        next(error);
    }
}

export const getMessages = async (req, res, next) => {
    try {
        const conversationId = req.params.conversationId;
        if(!conversationId) {
            logger.error("conversationId params is not found")
            res.sendStatus(400);
        }
        const messages = await getConversationMessages(conversationId);
        res.json(messages);
    } catch (error) {
        next(error);
    }
}