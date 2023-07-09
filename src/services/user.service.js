import { UserModel } from "../models/index.js";
import createHttpError from "http-errors";

export const findUser = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw createHttpError.BadRequest("Cannot find user related to the userId");
    }
    return user;
  } catch (error) {
    throw createHttpError.BadGateway(
      "Something went wrong, cannot find the user"
    );
  }
};

export const searchUsers = async (keyword, searcherUserId) => {
  try {
    // Look for the users in the db based on user's name or email but not return the searcher user
    const users = await UserModel.find({
      _id: { $ne: searcherUserId },
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    });

    // It's okay to return an empty array;
    return users;
  } catch (error) {
    throw createHttpError.BadGateway("Error search users");
  }
};
