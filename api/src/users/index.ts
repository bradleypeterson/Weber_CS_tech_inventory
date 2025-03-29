import { type Request, type Response, Router } from "express";
import { getUserDetails } from "../db/procedures/users";
import { addUser } from "./add";
import { listUsers } from "./list";
import { updateUser } from "./update";
export const userRouter = Router();

userRouter.get("/list", listUsers);
userRouter.post("/:id/update", updateUser);
userRouter.post("/add", addUser);
userRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await getUserDetails(Number(id));
    if (user === undefined) {
      res.status(404).json({ status: "error", error: { message: "User does not exist" } });
      return;
    }
    res.json({ status: "success", data: user });
  } catch (error) {
    console.error(`Error in getUserDetails endpoint:`, error);
    res.status(500).json({ status: "error", error: { message: "Could not get user details" } });
  }
});
