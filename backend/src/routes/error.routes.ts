import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getAllErrors } from "../controllers/error.controller";

const router = Router()

router.get('/' , authMiddleware , getAllErrors)

export default router;