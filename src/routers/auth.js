import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserSchema } from "../validation/registerUserSchema.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { registerUserController } from "../controllers/auth.js";

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));

export default authRouter;
