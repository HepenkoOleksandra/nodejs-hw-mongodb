import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserSchema } from "../validation/registerUserSchema.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { generateOAuthUrlController, loginUserController, logoutUserController, refreshUserSessionController, registerUserController, resetPasswordController, sendResetEmailController, verifyGoogleOAuthController } from "../controllers/auth.js";
import { loginUserSchema } from "../validation/loginUserSchema.js";
import { sendResetEmailSchema } from "../validation/sendResetEmailSchema.js";
import { resetPasswordSchema } from "../validation/resetPasswordSchema.js";
import { verifyGoogleOAuthSchema } from "../validation/verifyGoogleOAuthSchema.js";

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));

authRouter.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));

authRouter.post('/logout', ctrlWrapper(logoutUserController));

authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));

authRouter.post('/send-reset-email', validateBody(sendResetEmailSchema), ctrlWrapper(sendResetEmailController));

authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

authRouter.post('/get-oauth-url', ctrlWrapper(generateOAuthUrlController));

authRouter.post('/verify-google-oauth', validateBody(verifyGoogleOAuthSchema), ctrlWrapper(verifyGoogleOAuthController));

export default authRouter;
