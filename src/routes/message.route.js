import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
import { postMessage, getMessages } from "../controllers/message.controller.js"

const router = express.Router();

router.post("/", trimRequest.all, authMiddleware, postMessage )
router.get("/:conversation_id", trimRequest.all, authMiddleware, getMessages )

export default router;