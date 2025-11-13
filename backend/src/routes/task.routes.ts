import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  addTask,
  deleteTask,
  getTaskById,
  getUsersTask,
  updateTask,
} from "../controllers/task.controller";

const router = Router();

router.post("/create", authMiddleware, addTask);

router.get("/", authMiddleware, getUsersTask);

router.delete("/:id", authMiddleware, deleteTask);

router.put("/:id", authMiddleware, updateTask);

router.get("/:id", authMiddleware, getTaskById);

export default router;
