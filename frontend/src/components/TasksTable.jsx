import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/url";
import { toast } from "react-toastify";

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  const [editingTask, setEditingTask] = useState(null); // Holds current task to edit

  const fetchTasks = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await axios.get(`${BASE_URL}/tasks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      setTasks(data.tasks || []);
      setFilteredTasks(data.tasks || []);
      toast.success("Tasks fetched successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch tasks");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await axios.post(
        `${BASE_URL}/tasks/admin/delete`,
        { taskId },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      toast.success("Task deleted successfully");
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
      applyFilters(updatedTasks, filters);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { _id, status, priority, dueDate, reminderAt, title, description } =
        editingTask;

      const { data } = await axios.post(
        `${BASE_URL}/tasks/admin/edit`,
        {
          title,
          description,
          taskId: _id,
          status,
          priority,
          dueDate,
          reminderAt,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      toast.success(data.message);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Edit failed");
    }
  };

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    applyFilters(tasks, newFilters);
  };

  const applyFilters = (allTasks, activeFilters) => {
    let temp = [...allTasks];

    if (activeFilters.status) {
      temp = temp.filter((t) => t.status === activeFilters.status);
    }
    if (activeFilters.priority) {
      temp = temp.filter((t) => t.priority === activeFilters.priority);
    }

    setFilteredTasks(temp);
  };

  const handleReset = () => {
    setFilters({ status: "", priority: "" });
    setFilteredTasks(tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="overflow-x-auto p-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border border-gray-300 px-3 py-2 rounded"
        >
          <option value="">Filter by Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
          className="border border-gray-300 px-3 py-2 rounded"
        >
          <option value="">Filter by Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset Filters
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-300 text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Description</th>
            <th className="p-2">Priority</th>
            <th className="p-2">Status</th>
            <th className="p-2">Due Date</th>
            <th className="p-2">Reminder At</th>
            <th className="p-2">Assigned To</th>
            <th className="p-2">Created By</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task._id} className="border-t">
              <td className="p-2">{task.title}</td>
              <td className="p-2">{task.description}</td>
              <td className="p-2 capitalize">{task.priority}</td>
              <td className="p-2 capitalize">{task.status}</td>
              <td className="p-2">{task.dueDate?.split("T")[0]}</td>
              <td className="p-2">{task.reminderAt?.split("T")[0]}</td>
              <td className="p-2">{task.assignedTo}</td>
              <td className="p-2">{task.createdBy}</td>
              <td className="p-2 space-x-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  onClick={() => setEditingTask(task)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filteredTasks.length === 0 && (
            <tr>
              <td colSpan="9" className="p-4 text-center text-gray-500">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center z-5">
          <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Task</h3>

            <label className="block mb-2">
              Title:
              <input
                type="text"
                className="w-full border px-2 py-1 rounded"
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, title: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              Description:
              <textarea
                className="w-full border px-2 py-1 rounded"
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    description: e.target.value,
                  })
                }
              />
            </label>

            <label className="block mb-2">
              Status:
              <select
                className="w-full border px-2 py-1 rounded"
                value={editingTask.status}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>

            <label className="block mb-2">
              Priority:
              <select
                className="w-full border px-2 py-1 rounded"
                value={editingTask.priority}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, priority: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="block mb-2">
              Due Date:
              <input
                type="date"
                className="w-full border px-2 py-1 rounded"
                value={editingTask.dueDate?.split("T")[0]}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, dueDate: e.target.value })
                }
              />
            </label>

            <label className="block mb-4">
              Reminder At:
              <input
                type="date"
                className="w-full border px-2 py-1 rounded"
                value={editingTask.reminderAt?.split("T")[0]}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    reminderAt: e.target.value,
                  })
                }
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleEditSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksTable;
