import createHttpError from "http-errors";
import { ConversationModel, UserModel } from "../models/index.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const doesConversationExist = async (sender_id, receiver_id) => {
  let conversations = await ConversationModel.find({
    isGroup: false,
    users: {
      $all: [new ObjectId(sender_id), new ObjectId(receiver_id)],
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

export const getUserConversations = async (user_id) => {
  let conversations;
  await ConversationModel.find({
    users: new ObjectId(user_id),
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await UserModel.populate(results, {
        path: "latestMessage.sender",
        select: "name email picture status",
      });
      conversations = results;
    })
    .catch((error) => {
      throw createHttpError.BadRequest("something went wrong");
    });
    return conversations;
};
