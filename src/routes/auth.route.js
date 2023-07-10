/*----------IMPORT----------*/
import express from "express";

// Middlewares
import trimRequest from "trim-request";
import { body, cookie } from "express-validator";
import HTTPRequestValidator from "../middlewares/HTTPRequestValidator.middleware.js";

// Controllers
import {
  postLogin,
  postLogout,
  postRefreshToken,
  postRegister,
} from "../controllers/auth.controller.js";

/*----------ROUTE LOGIC----------*/
const router = express.Router();

// Route /auth/register/
/// receive body: name!, email!, password!, status, picture
router
  .route("/register")
  .post(
    trimRequest.body,
    [
      body("name")
        .exists({ values: "falsy" })
        .withMessage(
          "Req body name value must be passed and cannot empty string"
        )
        .isLength({ min: 2, max: 25 })
        .withMessage(
          "Req body name characters should be between 2 and 25 characters"
        ),
      body("email")
        .exists({ values: "falsy" })
        .withMessage(
          "Req body email value must be passed and cannot empty string"
        )
        .isEmail()
        .withMessage("Req body email must be in valid format")
        .toLowerCase(),
      body("password")
        .exists({ values: "falsy" })
        .withMessage(
          "Req body password value must be passed and cannot empty string"
        )
        .isLength({ min: 6, max: 128 })
        .withMessage("Req body password must be in 6 and 128 characters"),
      body("status")
        .optional({ values: "falsy" })
        .isLength({ min: 1, max: 64 })
        .withMessage(),
      body("picture").optional({ value: "falsy" }),
    ],
    HTTPRequestValidator,
    postRegister
  );

// Route /auth/login/
/// Receive body: email!, password!
router
  .route("/login")
  .post(
    trimRequest.body,
    [
      body("email")
        .exists({ values: "falsy" })
        .withMessage(
          "Req body email value must be passed and cannot empty string"
        )
        .isEmail()
        .withMessage("Req body email must be in valid format")
        .toLowerCase(),
      body("password")
        .exists({ values: "falsy" })
        .withMessage(
          "Req body password value must be passed and cannot empty string"
        ),
    ],
    HTTPRequestValidator,
    postLogin
  );

// Route /auth/logout/
router.route("/logout").post(trimRequest.all, postLogout);

// Route /auth/refreshToken/
/// receive cookie: refreshToken!
router
  .route("/refreshToken")
  .post(
    trimRequest.all,
    [
      cookie("refreshToken")
        .exists({ values: "falsy" })
        .withMessage("Req cookie refreshToken wasn't found"),
    ],
    HTTPRequestValidator,
    postRefreshToken
  );

export default router;
