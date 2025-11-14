import { z } from "zod";

export const priorityEnum = z.enum(["low", "medium", "high"]);
export type Priority = z.infer<typeof priorityEnum>;

export const statusEnum = z.enum(["todo", "in-progress", "done"]);
export type Status = z.infer<typeof statusEnum>;

const dateString = z
  .string()
  .refine((val) => !Number.isNaN(Date.parse(val)), { message: "Invalid date" });

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  deadline: dateString,
  priority: priorityEnum,
  status: statusEnum.optional(),
  completed: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  deadline: dateString.optional(),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  completed: z.boolean().optional(),
});
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const taskSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  deadline: dateString,
  status: statusEnum,
  priority: priorityEnum,
  completed: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type Task = z.infer<typeof taskSchema>;

export const addTaskResponseSchema = z.object({
  succcess: z.boolean().optional(),
  success: z.boolean().optional(),
  message: z.string().optional(),
  task: taskSchema,
});
export type AddTaskResponse = z.infer<typeof addTaskResponseSchema>;

export const taskStatisticsSchema = z.object({
  total: z.number(),
  completed: z.number(),
  due: z.number(),
  upcoming: z.number(),
});
export type TaskStatistics = z.infer<typeof taskStatisticsSchema>;

export const getTasksResponseSchema = z.object({
  success: z.boolean(),
  tasks: z.array(taskSchema),
  statistics: taskStatisticsSchema,
});
export type GetTasksResponse = z.infer<typeof getTasksResponseSchema>;

export const deleteTaskResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});
export type DeleteTaskResponse = z.infer<typeof deleteTaskResponseSchema>;

export const updateTaskResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  task: taskSchema.optional(),
});
export type UpdateTaskResponse = z.infer<typeof updateTaskResponseSchema>;

export const getTaskByIdResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  task: taskSchema.optional(),
});
export type GetTaskByIdResponse = z.infer<typeof getTaskByIdResponseSchema>;
