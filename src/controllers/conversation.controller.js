import {
  searchConversations,
  createConversation,
  populateConversation,
  getUserConversations,
} from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";

const { DEFAULT_GROUP_PICTURE_URL } = process.env;

export const postCreateOpenConversation = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, isGroup } = req.body;
    console.log("isGroup value: ", isGroup);
    if (isGroup == false) {
      const conversation = await searchConversations(senderId, receiverId, false);

      if (conversation) {
        res.json(conversation);
      } else {
        const conversationData = {
          name: "conversation name",
          picture: "conversation picture",
          isGroup: false,
          users: [senderId, receiverId],
        };
        const newConversation = await createConversation(conversationData);
        const populatedConversation = await populateConversation(
          newConversation._id,
          "users",
          "-password"
        );
        res.json(populatedConversation);
      }
    } else {
        const groupConversation = await searchConversations("", "", isGroup);
        res.json(groupConversation);
    }
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const conversationsFound = await getUserConversations(userId);
    res.status(200).json(conversationsFound);
  } catch (error) {
    next(error);
  }
};

export const postCreateGroup = async (req, res, next) => {
  try {
    const { name, users } = req.body;
    users.push(req.user.userId);
    if (users.length < 2) {
      throw createHttpError.BadRequest(
        "At least 2 users are required to start a group chat."
      );
    }
    const conversationData = {
      name,
      users,
      isGroup: true,
      admin: req.user.userId,
      picture: DEFAULT_GROUP_PICTURE_URL,
    };

    const newConversation = await createConversation(conversationData);
    const populatedConversation = await populateConversation(
      newConversation._id,
      "users admin",
      "-password"
    );
    res.status(200).json(populatedConversation);
  } catch (error) {
    next(error);
  }
};
