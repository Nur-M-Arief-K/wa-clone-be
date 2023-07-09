/*----------IMPORT----------*/
import express from "express";

// Middlewares
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";

// Controllers
import {
  postCreateOpenConversation,
  getConversations,
} from "../controllers/conversation.controller.js";

/*----------ROUTE LOGIC----------*/
const router = express.Router();

// Route /conversation/
router
  .route("/")
  .get(authMiddleware, trimRequest.all, getConversations)
  .post(authMiddleware, trimRequest.all, postCreateOpenConversation);

export default router;
