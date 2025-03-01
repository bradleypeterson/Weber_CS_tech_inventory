import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { json } from "express";
import morgan from "morgan";
import { assetClassRouter } from "./assetClass";
import { assetRouter } from "./assets";
import { authRouter } from "./auth";
import { validateToken } from "./auth/validateToken";
import { departmentRouter } from "./department";
config(); // Load environment variables

const app = express();
const port = process.env.PORT;

app.use(json());
app.use(
  cors({ credentials: true, origin: ["http://127.0.0.1:3000", "http://localhost:3000", "http://localhost:5173"] })
);
app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
    const status = tokens.status(req, res);
    return `${tokens.method(req, res)} ${tokens.url(req, res)} ${status}`;
  })
);
app.use(cookieParser());

app.use("/auth", authRouter);

// Routes below this line require the user to be logged in
app.use(validateToken);
app.use("/assets", assetRouter);
app.use("/asset-classes", assetClassRouter);
app.use("/departments", departmentRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
