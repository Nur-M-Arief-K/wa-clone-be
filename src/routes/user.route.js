/*----------IMPORT----------*/
import express from "express";

// Middlewares
import trimRequest from "trim-request";
import { query } from "express-validator";
import authMiddleware from "../middlewares/auth.middleware.js";
import HTTPRequestValidator from "../middlewares/HTTPRequestValidator.middleware.js";

// Controllers
import { getSearchUsers } from "../controllers/user.controller.js";

/*----------ROUTE LOGIC----------*/
const router = express.Router();

// Route /user/
/// Receive { query: ["search"] }
router
  .route("/")
  .get(
    authMiddleware,
    trimRequest.query,
    [
      query("search")
        .exists({ values: "falsy" })
        .withMessage("search query must be passed and cannot be an empty string")
        .toLowerCase(),
    ],
    HTTPRequestValidator,
    getSearchUsers
  );

export default router;
