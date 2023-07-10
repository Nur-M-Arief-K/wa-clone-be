import createHttpError from "http-errors";
import { sign, verify } from "../utils/token.util.js";

export const generateToken = async (payload, expiresIn, secret) => {
  try {
    const token = await sign(payload, expiresIn, secret);
    return token;
  } catch (error) {
    throw createHttpError.BadGateway("Cannot generate token");
  }
};

export const verifyToken = async (token, secret) => {
  try {
    const check = await verify(token, secret);
    return check;
  } catch (error) {
    throw createHttpError.BadGateway("Cannot verify token");
  }
};
