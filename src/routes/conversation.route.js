import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
import { postCreateOpenConversation, getConversations } from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/", trimRequest.all, authMiddleware, postCreateOpenConversation)
router.get("/", trimRequest.all, authMiddleware, getConversations)

export default router;