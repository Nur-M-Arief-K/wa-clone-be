import { createUser } from "../services/auth.service.js";
import { generateToken, verifyToken } from "../services/token.service.js";
import { signUser } from "../services/auth.service.js";
import { findUser } from "../services/user.service.js";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const postRegister = async (req, res, next) => {
  try {
    const { name, email, picture, status, password } = req.body;
    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });
    const access_token = await generateToken(
      { userId: newUser._id },
      "1d",
      ACCESS_TOKEN_SECRET
    );
    const refresh_token = await generateToken(
      { userId: newUser._id },
      "30d",
      REFRESH_TOKEN_SECRET
    );

    res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/auth/refreshtoken",
        maxAge: 30 * 24 * 40 * 60 * 1000 // 30 days
    })
    
    res.json({
        message: "user register success",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          picture: newUser.picture,
          status: newUser.status,
          access_token,
        }
    });
  } catch (error) {
    next(error);
  }
};

export const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await signUser(email, password);
    const access_token = await generateToken(
        { userId: user._id },
        "1d",
        ACCESS_TOKEN_SECRET
      );
      const refresh_token = await generateToken(
        { userId: user._id },
        "30d",
        REFRESH_TOKEN_SECRET
      );
  
      res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/api/v1/auth/refreshtoken",
          maxAge: 30 * 24 * 40 * 60 * 1000 // 30 days
      })
      
      res.json({
          message: "user register success",
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            status: user.status,
            access_token,
          }
      });
  } catch (error) {
    next(error);
  }
};

export const postLogout = async (req, res, next) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/v1/auth/refreshtoken" });
    res.json({
      message: "logout successful!",
    });
  } catch (error) {
    next(error);
  }
};

export const postRefreshToken = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refreshtoken;

    if (!refresh_token) throw createHttpError.Unauthorized("Please login.");

    const check = await verifyToken(
      refresh_token,
      REFRESH_TOKEN_SECRET
    );
    const user = await findUser(check.userId);
    const access_token = await generateToken(
      { userId: user._id },
      "1d",
      ACCESS_TOKEN_SECRET
    );
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};
