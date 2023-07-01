import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import routes from "./routes/index.js";
import pageNotFound from "./middlewares/page-not-found.middleware.js";
import errorRequestHandler from "./middlewares/error-request-handler.middleware.js";

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cookieParser());
app.use(compression());
app.use(fileUpload({ useTempFiles: true }));
app.use(cors());
app.use("/api/v1", routes);

// http request route not found
app.use(pageNotFound);

// handle http request error
app.use(errorRequestHandler);

export default app;
