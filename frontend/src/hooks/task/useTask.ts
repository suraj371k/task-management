import { taskService } from "@/services/task.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// CREATE
export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// GET ALL
export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getUserTasks,
  });
};

// GET ONE
export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => taskService.getTaskById(id),
  });
};

export const useUpdateTask = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title?: string;
      description?: string | null;
      deadline?: string;
      priority?: "low" | "medium" | "high";
      status?: "todo" | "in-progress" | "done";
      completed?: boolean;
    }) => taskService.updateTask(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["task", id] });
    },
  });
};

// DELETE
export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
