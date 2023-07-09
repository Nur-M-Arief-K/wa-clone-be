import { ConversationModel, MessageModel } from "../models/index.js";
import createHttpError from "http-errors";

export const createMessage = async (messageData) => {
  try {
    const newMessage = await MessageModel.create(messageData);
    return newMessage;
  } catch (error) {
    throw createHttpError.BadGateway("Error creating message document");
  }
};

export const populateMessage = async (messageId) => {
  try {
    const message = await MessageModel.findById(messageId)
      .populate({
        path: "sender",
        select: "name picture",
        model: "UserModel",
      })
      .populate({
        path: "conversation",
        select: "name picture isGroup users",
        model: "ConversationModel",
        populate: {
          path: "users",
          select: "name email picture status",
          model: "UserModel",
        },
      });

    return message;
  } catch (error) {
    throw createHttpError.BadGateway("Error populate message document");
  }
};

export const updateLatestMessage = async (conversation_id, message) => {
  try {
    const updatedConversation = await ConversationModel.findByIdAndUpdate(
      conversation_id,
      {
        latestMessage: message,
      }
    );
    return updatedConversation;
  } catch (error) {
    throw createHttpError.BadGateway(
      "Failed to update conversation latest message"
    );
  }
};

export const getConversationMessages = async (conversationId) => {
  try {
    const messages = await MessageModel.find({
      conversation: conversationId,
    })
      .populate({ path: "sender", select: "name picture email status" })
      .populate("conversation");
    return messages;
  } catch (error) {
    throw createHttpError.BadGateway("Error get conversation messages");
  }
};
