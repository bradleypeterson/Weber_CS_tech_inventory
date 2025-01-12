import express, { json, type Request } from "express";
import { syncRouter } from "./sync";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = 8080;

app.use(json());
app.use(
  cors({ credentials: true, origin: ["http://127.0.0.1:3000", "http://localhost:3000", "http://localhost: 5173"] })
);
app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
    const status = tokens.status(req, res);
    return `${tokens.method(req, res)} ${tokens.url(req, res)} ${status}`;
  })
);
app.use(cookieParser());

app.listen(port, () => console.log("Server running on port 8080"));

app.use("/sync", syncRouter);
