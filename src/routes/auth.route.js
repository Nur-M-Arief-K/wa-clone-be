/*----------IMPORT----------*/
import express from "express";

// Middlewares
import trimRequest from "trim-request";

// Controllers
import {
  postLogin,
  postLogout,
  postRefreshToken,
  postRegister,
} from "../controllers/auth.controller.js";

/*----------ROUTE LOGIC----------*/
const router = express.Router();

// Route /auth/register/
router.route("/register").post(trimRequest.all, postRegister);

// Route /auth/login/
router.route("/login").post(trimRequest.all, postLogin);

// Route /auth/logout/
router.route("/logout").post(trimRequest.all, postLogout);

// Route /auth/refreshToken/
router.route("/refreshToken").post(trimRequest.all, postRefreshToken);

export default router;
