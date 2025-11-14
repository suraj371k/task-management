import { useProfile, useLogout } from "@/hooks/auth/useAuth";
import { useTasks } from "@/hooks/task/useTask";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, CheckCircle2, Clock, Calendar, User, BookDashed, BookDashedIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userData } = useProfile();
  const { data: tasksData } = useTasks();
  const logoutMutation = useLogout();

  const isAuthPage =
    location.pathname === "/login" || location.pathname.includes("/login");

  const user = userData?.user;
  const tasks = tasksData?.tasks || [];

  const completedTasks = tasks.filter((task) => task.completed === true).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueTasks = tasks.filter((task) => {
    if (task.completed) return false;
    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline <= today;
  }).length;

  const upcomingTasks = tasks.filter((task) => {
    if (task.completed) return false;
    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline > today;
  }).length;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        queryClient.clear();
        navigate("/login", { replace: true });
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to logout";
        toast.error(errorMessage);
        queryClient.clear();
        navigate("/login", { replace: true });
      },
    });
  };

  if (isAuthPage) {
    return null;
  }

  return (
    <div className="h-screen w-64 bg-slate-50 text-slate-800 flex flex-col border-r border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Task Manager</h2>
      </div>

      {/* Navigation Buttons */}
      <div className="flex-1 p-4 space-y-2">
        <Button className="bg-linear-to-r w-full from-blue-600 to-purple-600 text-white"> 
          <BookDashedIcon />
          Dashboard</Button>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-slate-50">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
