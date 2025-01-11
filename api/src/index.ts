import express, { type Request } from "express";

const app = express();
const port = 8080;

app.listen(port, () => console.log("Server running on port 8080"));
