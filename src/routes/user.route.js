import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getSearchUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", trimRequest.all, authMiddleware, getSearchUsers);

export default router;
