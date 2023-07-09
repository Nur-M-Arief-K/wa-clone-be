import {
  createMessage,
  populateMessage,
  updateLatestMessage,
  getConversationMessages,
} from "../services/message.service.js";

export const postMessage = async (req, res, next) => {
  try {
    // Extract user id, conversationId, message, files; Create new message document; Populate new message field; Update conversation document latest message
    const userId = req.user.userId;
    const { message, conversationId, files } = req.body;

    const messageData = {
      sender: userId,
      message,
      conversation: conversationId,
      files: files || [],
    };
    const newMessage = await createMessage(messageData);
    const populatedMessage = await populateMessage(newMessage._id);
    await updateLatestMessage(conversationId, newMessage);
    res.json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  // Extract conversation id from the params; Passes it to getConversationMessages; Send the messages found back to client;
  try {
    const conversationId = req.params.conversationId;
    const messagesFound = await getConversationMessages(conversationId);
    res.json(messagesFound);
  } catch (error) {
    next(error);
  }
};
