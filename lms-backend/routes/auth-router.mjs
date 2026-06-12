import { Router } from "express";
import { forgotPassword, login, logout, me, registerUser } from "../controllers/auth-controller.mjs";
import verfiyToken from "../middleware/verify-token.mjs";
const router = new Router();

router.post("/register", registerUser)

router.post("/login", login)

router.post("/logout", logout)

router.post("/forgot-password", forgotPassword)

router.get("/me", verfiyToken, me)

export default router;
