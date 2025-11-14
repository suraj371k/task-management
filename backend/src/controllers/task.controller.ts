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

    const backendStatus = status === "done" ? "completed" : status;

    const task = await Task.create({
      userId,
      title,
      description,
      deadline,
      status: backendStatus,
      completed,
    });

    const taskObj = task.toObject() as any;
    if (taskObj.status === "completed") {
      taskObj.status = "done";
    }

    return res
      .status(201)
      .json({ success: true, message: "task created successfully ", task: taskObj });
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

    const tasks = await Task.find({ userId });

    const mappedTasks = tasks.map((task) => {
      const taskObj = task.toObject() as any;
      if (taskObj.status === "completed") {
        taskObj.status = "done";
      }
      return taskObj;
    });

    const now = new Date();
    const total = mappedTasks.length;
    const completed = mappedTasks.filter(
      (task: any) => task.completed === true || task.status === "done"
    ).length;
    const due = mappedTasks.filter(
      (task: any) =>
        new Date(task.deadline) < now &&
        task.completed !== true &&
        task.status !== "done"
    ).length;
    const upcoming = mappedTasks.filter(
      (task: any) =>
        new Date(task.deadline) >= now &&
        task.completed !== true &&
        task.status !== "done"
    ).length;

    return res.status(200).json({
      success: true,
      statistics: {
        total,
        completed,
        due,
        upcoming,
      },
      tasks: mappedTasks,
    });
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

    if (status) {
      if (status === "done") {
        task.status = "completed";
        task.completed = true;
      } else {
        task.status = status;
        if (completed !== undefined) {
          task.completed = completed;
        }
      }
    }

    if (title) task.title = title;

    if (description !== undefined) task.description = description;

    if (deadline) task.deadline = deadline;

    if (priority) task.priority = priority;

    if (!status && completed !== undefined) {
      task.completed = completed;
      if (completed) {
        task.status = "completed";
      } else if (task.status === "completed") {
        task.status = "todo";
      }
    }

    await task.save();

    const taskObj = task.toObject() as any;
    if (taskObj.status === "completed") {
      taskObj.status = "done";
    }

    return res
      .status(200)
      .json({ success: true, message: "task updated successfully", task: taskObj });
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

    // Map backend "completed" status to frontend "done" status
    const taskObj = task.toObject() as any;
    if (taskObj.status === "completed") {
      taskObj.status = "done";
    }

    return res.status(200).json({
      success: true,
      message: "task by id fetched successfully",
      task: taskObj,
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
