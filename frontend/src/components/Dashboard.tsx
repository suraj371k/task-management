import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import TaskList from "./TaskList";
import { useTasks } from "@/hooks/task/useTask";
import CreateTaskDialog from "./CreateTaskDialog";

const Dashboard = () => {
  const { data, isLoading } = useTasks();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const stats = [
    { id: 1, title: "Total", task: data?.tasks.length },
    { id: 2, title: "Due", task: data?.statistics.due },
    { id: 3, title: "Completed", task: data?.statistics.completed },
    { id: 4, title: "Upcoming", task: data?.statistics.upcoming },
  ];

  return (
    <div className="mt-20 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          className="bg-linear-to-r from-blue-600 to-purple-600 text-white"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Task
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition"
          >
            <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.task}</p>
          </div>
        ))}
      </div>

      <div>
        <TaskList />
      </div>

      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default Dashboard;
