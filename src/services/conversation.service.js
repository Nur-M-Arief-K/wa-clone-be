import createHttpError from "http-errors";
import { ConversationModel, UserModel } from "../models/index.js";

export const doesConversationExist = async (sender_id, receiver_id) => {
  let conversations = await ConversationModel
    .find({
      isGroup: false,
      user: {
        $all: [sender_id, receiver_id],
      },
    })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!conversations)
    throw createHttpError.BadRequest("Oops...Something went wrong !");

  //populate message model
  conversations = await UserModel.populate(conversations, {
    path: "latestMessage.sender",
    select: "name email picture status",
  });

  return conversations[0];
};

export const createConversation = async (data) => {
  const newConversation = await ConversationModel.create(data);
  if (!newConversation) {
    throw createHttpError.BadRequest("something went wrong");
  }
  return newConversation;
};

export const populateConversation = async (
  id,
  fieldsToPopulate,
  fieldsToRemove
) => {
  const populatedConversation = await ConversationModel.findOne({
    _id: id,
  }).populate(fieldsToPopulate, fieldsToRemove);

  if (!populatedConversation) {
    throw createHttpError.BadRequest("something went wrong");
  }
  return populatedConversation;
};
