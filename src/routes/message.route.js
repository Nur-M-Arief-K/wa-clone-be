/*----------IMPORT----------*/
import express from "express";

// Middlewares
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";

// Controllers
import { postMessage, getMessages } from "../controllers/message.controller.js";

/*----------ROUTE LOGIC----------*/
const router = express.Router();

// Route /message/
router.route("/").post(authMiddleware, trimRequest.all, postMessage);

// Route /message/:conversationId
router
  .route("/:conversationId")
  .get(authMiddleware, trimRequest.all, getMessages);

export default router;
