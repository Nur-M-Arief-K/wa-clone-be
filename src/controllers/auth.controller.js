import { createUser } from "../services/auth.service.js";
import { generateToken } from "../services/token.service.js";

export const postRegister = async (req, res, next) => {
  const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

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
        path: "api/v1/auth/refreshtoken",
        maxAge: 30 * 24 * 40 * 60 * 1000 // 30 days
    })
    
    res.json({
        message: "user register success",
        access_token,
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            picture: newUser.picture,
            status: newUser.status,
        }
    });
  } catch (error) {
    next(error);
  }
};

export const postLogin = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const postLogout = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const postRefreshToken = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
