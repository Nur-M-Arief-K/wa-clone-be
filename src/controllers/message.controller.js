import logger from "../configs/logger.config.js";
import { createMessage, populateMessage, updateLatestMessage, getConversationMessages } from "../services/message.service.js";

export const postMessage = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const { message, conversation_id, files } = req.body;
        if (!conversation_id || (!message && !files)) {
            logger.error("Invalid post message request");
            return res.sendStatus(400);
        }
        const msgData = {
            sender: user_id,
            message,
            conversation: conversation_id,
            files: files || []
        };
        let newMessage = await createMessage(msgData);
        let populatedMessage = await populateMessage(newMessage._id);
        await updateLatestMessage(conversation_id, newMessage);
        res.json(populatedMessage);
    } catch (error) {
        next(error);
    }
}

export const getMessages = async (req, res, next) => {
    try {
        const conversation_id = req.params.conversation_id;
        if(!conversation_id) {
            logger.error("conversation_id params is not found")
            res.sendStatus(400);
        }
        const messages = await getConversationMessages(conversation_id);
        res.json(messages);
    } catch (error) {
        next(error);
    }
}