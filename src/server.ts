import express, { urlencoded } from "express";
import { createServer } from "http";
import cors from "cors";
import "./config/database/connect";
import routes from "./api/routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swaggerConfig";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://corenotes.netlify.app",
  "https://corenotes.net",
  "www.corenotes.net",
  "https://34.197.199.182",
  "http://127.0.0.1:3100",
];
const options: cors.CorsOptions = { origin: allowedOrigins, credentials: true };

app.use(cors(options));

// app.set("trust proxy", true);

// parses incoming JSON payloads
app.use(express.json());
app.use(cookieParser());

// parses incoming string or arrays payloads
app.use(urlencoded({ extended: true }));
// configure routes
app.use("/api/v1", routes());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = createServer(app);

server.listen(process.env.PORT, () => {
  console.log(
    `############# SERVER IS UP ON PORT: ${process.env.PORT} ####################`
  );
});
