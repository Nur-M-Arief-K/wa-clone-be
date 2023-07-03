import mongoose from "mongoose";
import validator from "validator";

const { DEFAULT_USER_PICTURE_URL, DEFAULT_USER_STATUS } = process.env;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name cannot be empty"],
    },
    email: {
      type: String,
      required: [true, "Email cannot be empty"],
      unqiue: [true, "This email address is already exist"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    picture: {
      type: String,
      default: DEFAULT_USER_PICTURE_URL,
    },
    status: {
      type: String,
      default: DEFAULT_USER_STATUS,
    },
    password: {
      type: String,
      required: [true, "Passsword cannot be empty"],
      minLength: [
        6,
        "Password should have minimum 6 characters long",
      ],
      maxLength: [
        128,
        "Password should not exceeding 128 characters long",
      ],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const UserModel =
  mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

export default UserModel;