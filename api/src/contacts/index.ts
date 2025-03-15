import { Router } from "express";
import { listContacts } from "./list";
export const contactRouter = Router();

contactRouter.get("/list", listContacts);
