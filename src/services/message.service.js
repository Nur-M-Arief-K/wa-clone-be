import createHttpError from "http-errors";
import { ConversationModel, MessageModel } from "../models/index.js";

export const createMessage = async (data) => {
  let newMessage = await MessageModel.create(data);
  if (!newMessage) {
    throw createHttpError.BadRequest("somehing went wrong");
  }
  return newMessage;
};

export const populateMessage = async (id) => {
  let msg = await MessageModel.findById(id)
    .populate({
      path: "sender",
      select: "name picture",
      model: "UserModel",
    })
    .populate({
      path: "conversation",
      select: "name isGroup users",
      model: "ConversationModel",
      populate: {
        path: "users",
        select: "name email picture status",
        model: "UserModel",
      },
    });

  if (!msg) {
    throw createHttpError.BadRequest("something went wrong");
  }

  return msg;
};

export const updateLatestMessage = async (conversation_id, msg) => {
  const updatedConversation = await ConversationModel.findByIdAndUpdate(
    conversation_id,
    {
      latestMessage: msg,
    }
  );

  if (!updatedConversation) {
    throw createHttpError.BadRequest("something went wrong");
  }

  return updatedConversation;
};

export const getConversationMessages = async (conversation_id) => {
  const messages = await MessageModel.find({
    conversation: conversation_id,
  }).populate({ path: "sender", select: "name picture email status" }).populate("conversation");
  if(!messages) {
    throw createHttpError.BadRequest("something went wrong")
  }
  return messages;
};
