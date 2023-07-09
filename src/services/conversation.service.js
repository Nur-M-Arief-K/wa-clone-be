import mongoose from "mongoose";
import { ConversationModel, UserModel } from "../models/index.js";
import createHttpError from "http-errors";

const ObjectId = mongoose.Types.ObjectId;

export const searchConversations = async (senderId, receiverId) => {
  try {
    const conversations = await ConversationModel.find({
      isGroup: false,
      users: {
        $all: [new ObjectId(senderId), new ObjectId(receiverId)],
      },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    // It's okay to return empty array

    const populatedConversations = await UserModel.populate(conversations, {
      path: "latestMessage.sender",
      select: "name email picture status",
    });

    return populatedConversations[0];
  } catch (error) {
    throw createHttpError.BadGateway(
      "Something went wrong, cannot find conversations"
    );
  }
};

export const createConversation = async (data) => {
  try {
    const newConversation = await ConversationModel.create(data);
    return newConversation;
  } catch (error) {
    throw createHttpError.BadGateway("Cannot create conversation");
  }
};

export const populateConversation = async (
  conversationId,
  fieldsToPopulate,
  fieldsToRemove
) => {
  try {
    const populatedConversation = await ConversationModel.findOne({
      _id: conversationId,
    }).populate(fieldsToPopulate, fieldsToRemove);

    if(!populateConversation) {
      throw createHttpError.BadRequest("No conversation document is find related to the conversationId")
    }

    return populatedConversation;
  } catch (error) {
    throw createHttpError.BadGateway("Cannot populate conversation");
  }
};

export const getUserConversations = async (userId) => {
  // Find conversations related to the user; Populate users document that mentioned in the conversations; Return the populated user documents data;
  try {
    const conversationsFound = await ConversationModel.find({
      users: new ObjectId(userId),
    })
      .populate("users", "-password")
      .populate("admin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

      // It's okay to return empty array

    const populatedConversationsFound = await UserModel.populate(
      conversationsFound,
      {
        path: "latestMessage.sender",
        select: "name email picture status",
      }
    );

    return populatedConversationsFound;
  } catch (error) {
    throw createHttpError.BadGateway("Error get conversations");
  }
};
