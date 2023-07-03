import express from "express";
import trimRequest from "trim-request";
import {
  postLogin,
  postLogout,
  postRefreshToken,
  postRegister,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", [trimRequest.all], postRegister);
router.post("/login", [trimRequest.all], postLogin);
router.post("/logout", [trimRequest.all], postLogout);
router.post("/refreshToken", [trimRequest.all], postRefreshToken);

export default router;
