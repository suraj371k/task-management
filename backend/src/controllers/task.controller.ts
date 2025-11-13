import { Request, Response } from "express";
import { logError } from "../config/errorLogger";
import Task from "../models/task.model";

export const addTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    const { title, description, deadline, priority, status, completed } =
      req.body;

    if (!title || !deadline || !priority) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required field" });
    }

    const task = await Task.create({
      userId,
      title,
      description,
      deadline,
      status,
      completed,
    });

    return res
      .status(201)
      .json({ succcess: true, message: "task created successfully ", task });
  } catch (error: any) {
    console.log("Error in add task controller", error);
    logError({
      message: "Add task Error",
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

export const getUsersTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log(userId);

    const tasks = await Task.find();

    return res.status(200).json({ success: true, tasks });
  } catch (error: any) {
    console.log("Error in add task controller", error);
    logError({
      message: "Add task Error",
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "task not found" });
    }

    await Task.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "task deleted successfully" });
  } catch (error: any) {
    console.log("Error in delete task controller", error);
    logError({
      message: "Delete Task Error",
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { id } = req.params;

    const { status, priority, completed, title, description, deadline } =
      req.body;

    if (!id)
      return res
        .status(404)
        .json({ success: false, message: "task not found" });

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (status) task.status = status;

    if (title) task.title = title;

    if (description) task.description = description;

    if (deadline) task.deadline = deadline;

    if (priority) task.priority = priority;

    if (completed) task.completed = completed;

    await task.save();

    return res
      .status(200)
      .json({ success: true, message: "task updated successfully", task });
  } catch (error: any) {
    console.log("Error in update task controller", error);
    logError({
      message: "Update Task Error",
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Internal server error" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "task by id fetched successfully",
        task,
      });
  } catch (error: any) {
    console.log("Error in get task by id controller", error);
    logError({
      message: "Get Task by id Error",
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
