import createHttpError from "http-errors";
import validator from "validator";
import { UserModel } from "../models/index.js";

const { DEFAULT_USER_PICTURE_URL, DEFAULT_USER_STATUS } = process.env;

export const createUser = async (userData) => {
  const { name, email, picture, status, password } = userData;
  if (!name || !email || !password) {
    throw createHttpError.BadRequest(
      "please provide name, email, and password information"
    );
  }

  //check name length
  if (
    !validator.isLength(name, {
      min: 2,
      max: 25,
    })
  ) {
    throw createHttpError.BadRequest(
      "name characters should be in between 2 and 16 characters."
    );
  }

  //Check status length
  if (status && status.length > 64) {
    throw createHttpError.BadRequest(
      "Status should be less than 64 characters."
    );
  }

  //check email address validity
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest(
      "Please enter valid email address."
    );
  }

  //check if user already exist
  const checkDb = await UserModel.findOne({ email });
  if (checkDb) {
    throw createHttpError.Conflict(
      "Please try again with a different email address, this email already exist."
    );
  }

  //check password length
  if (
    !validator.isLength(password, {
      min: 6,
      max: 128,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure your password is between 6 and 128 characters."
    );
  }

  //adding user to databse
  const user = await new UserModel({
    name,
    email,
    picture: picture || DEFAULT_USER_PICTURE_URL,
    status: status || DEFAULT_USER_STATUS,
    password,
  }).save();

  return user;
};
