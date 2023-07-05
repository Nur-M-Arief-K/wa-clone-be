import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
import { postCreateOpenConversation } from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/", trimRequest.all, authMiddleware, postCreateOpenConversation)

export default router;