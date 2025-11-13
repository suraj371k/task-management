import mongoose, { Schema, Document, model } from "mongoose";

interface ITask extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  description?: string;
  deadline: Date;
  completed?: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in-progress" | "completed";
  createdAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
    completed: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const Task = model("Task", taskSchema);

export default Task;
