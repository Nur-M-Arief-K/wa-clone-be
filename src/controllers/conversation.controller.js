import { searchConversations, createConversation, populateConversation, getUserConversations } from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";

export const postCreateOpenConversation = async (req, res, next) => {
    try {
        const senderId = req.user.userId;
        const { receiverId } = req.body;
        const conversation = await searchConversations(senderId, receiverId);

        if(conversation) {
            res.json(conversation);
        } else {
            const receiverUser = await findUser(receiverId);
            const conversationData = {
                name: receiverUser.name,
                picture: receiverUser.picture,
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
        const userId = req.user.userId;
        const conversationsFound = await getUserConversations(userId);
        res.status(200).json(conversationsFound);
    } catch (error) {
        next(error);
    }
}