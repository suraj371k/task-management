import { backendUrl } from "@/lib/backendUrl";
import {
  type CreateTaskInput,
  type UpdateTaskInput,
  createTaskSchema,
  updateTaskSchema,
  addTaskResponseSchema,
  getTasksResponseSchema,
  getTaskByIdResponseSchema,
  deleteTaskResponseSchema,
  updateTaskResponseSchema,
  type AddTaskResponse,
  type GetTasksResponse,
  type GetTaskByIdResponse,
  type DeleteTaskResponse,
  type UpdateTaskResponse,
} from "@/lib/validations/task";

export const taskService = {
  createTask: async (data: CreateTaskInput): Promise<AddTaskResponse> => {
    const validated = createTaskSchema.parse(data);

    const response = await backendUrl.post(`/api/task/create`, validated);

    return addTaskResponseSchema.parse(response.data);
  },

  getUserTasks: async (): Promise<GetTasksResponse> => {
    const response = await backendUrl.get(`/api/task`);
    return getTasksResponseSchema.parse(response.data);
  },

  getTaskById: async (id: string): Promise<GetTaskByIdResponse> => {
    const response = await backendUrl.get(`/api/task/${id}`);
    return getTaskByIdResponseSchema.parse(response.data);
  },

  updateTask: async (id: string, data: UpdateTaskInput): Promise<UpdateTaskResponse> => {
    const validated = updateTaskSchema.parse(data);

    const response = await backendUrl.put(`/api/task/${id}`, validated);
    return updateTaskResponseSchema.parse(response.data);
  },

  deleteTask: async (id: string): Promise<DeleteTaskResponse> => {
    const response = await backendUrl.delete(`/api/task/${id}`);
    return deleteTaskResponseSchema.parse(response.data);
  },
};
