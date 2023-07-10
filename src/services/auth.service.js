import createHttpError from "http-errors";
import { UserModel } from "../models/index.js";
import bcrypt from "bcrypt";

const { DEFAULT_USER_PICTURE_URL, DEFAULT_USER_STATUS } = process.env;

export const createUser = async (userData) => {
  try {
    // Create user document if only email is new
    const { name, email, picture, status, password } = userData;

    // Check if user already exist
    const checkDb = await UserModel.findOne({ email });
    if (checkDb) {
      throw createHttpError.Conflict(
        "Please try again with a different email address, this email already exist."
      );
    }

    // Hashing user password is done in user schema when its pre-saved
    // Adding user to databse
    const user = await new UserModel({
      name,
      email,
      picture: picture || DEFAULT_USER_PICTURE_URL,
      status: status || DEFAULT_USER_STATUS,
      password,
    }).save();

    return user;
  } catch (error) {
    throw createHttpError.BadGateway("Cannot create user, error in the db");
  }
};

export const signInUser = async (email, password) => {
  try {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();

    //check if user exist
    if (!user) {
      throw createHttpError.NotFound("Invalid credentials.");
    }

    //compare passwords
    let passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches)
      throw createHttpError.NotFound("Invalid credentials.");

    return user;
  } catch (error) {
    throw createHttpError.BadGateway("Cannot sign in user, error in the db");
  }
};
