/*----------IMPORT----------*/
import express from "express";

// Middlewares
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
import { body, oneOf } from "express-validator";
import HTTPRequestValidator from "../middlewares/HTTPRequestValidator.middleware.js";

// Controllers
import { postMessage, getMessages } from "../controllers/message.controller.js";

/*----------ROUTE LOGIC----------*/
const router = express.Router();

// Route /message/
/// receive body: conversationId, message, files
router
  .route("/")
  .post(
    authMiddleware,
    trimRequest.body,
    [
      body("conversationId")
        .exists({ values: "falsy" })
        .withMessage(
          "conversationId in req body must be passed and cannot be an empty string"
        ),
      oneOf(
        [
          body("message").exists({ values: "falsy" }),
          body("files").exists({ values: "falsy" }),
        ],
        { message: "One of message or files must be provided" }
      ),
    ],
    HTTPRequestValidator,
    postMessage
  );

// Route /message/:conversationId
/// receive params conversationId
router
  .route("/:conversationId")
  .get(authMiddleware, trimRequest.param, getMessages);

export default router;
