/*----------IMPORT----------*/
import express from "express";

// Middlewares
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
import HTTPRequestValidator from "../middlewares/HTTPRequestValidator.middleware.js";

// Controllers
import {
  postCreateOpenConversation,
  getConversations,
  postCreateGroup,
} from "../controllers/conversation.controller.js";

/*----------ROUTE LOGIC----------*/
const router = express.Router();

// Route /conversation/
router
  .route("/")
  .get(authMiddleware, trimRequest.all, getConversations)
  /// receive body: receiverId!
  .post(
    authMiddleware,
    trimRequest.body,
    [
      body("receiverId")
        .exists({ values: "falsy" })
        .withMessage(
          "receiverId in req body must be passed and cannot be an empty string"
        ),
    ],
    HTTPRequestValidator,
    postCreateOpenConversation
  );

// Route /conversation/group
router
  .route("/group")
  .post(
    authMiddleware,
    trimRequest.body,
    [
      body("name")
        .exists({ values: "falsy" })
        .withMessage(
          "name in req body must be passed and cannot be an empty string"
        ),
      body("users")
        .exists({ values: "falsy" })
        .withMessage(
          "users in req body must be passed and cannot be an empty string"
        ),
    ],
    HTTPRequestValidator,
    postCreateGroup
  );

export default router;
