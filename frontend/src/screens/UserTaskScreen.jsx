import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/url";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UserTaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newStatus, setNewStatus] = useState("pending");

  const { id } = useParams();

  const getTask = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get(`${BASE_URL}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      toast.success(data.message);
      setTasks(data.tasks);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch tasks");
    }
  };

  const openModal = (taskId, currentStatus) => {
    setSelectedTaskId(taskId);
    setNewStatus(currentStatus);
    setShowModal(true);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const updateStatus = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await axios.post(
        `${BASE_URL}/tasks/update`,
        {
          taskId: selectedTaskId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      toast.success(data.message || "Status updated");
      setShowModal(false);
      getTask();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update task");
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">User's Assigned Tasks</h2>
      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Description</th>
            <th className="p-2">Priority</th>
            <th className="p-2">Status</th>
            <th className="p-2">Due Date</th>
            <th className="p-2">Reminder</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks &&
            tasks.map((task) => (
              <tr key={task._id} className="border-t">
                <td className="p-2">{task.title}</td>
                <td className="p-2">{task.description}</td>
                <td className="p-2 capitalize">{task.priority}</td>
                <td className="p-2 capitalize">{task.status}</td>
                <td className="p-2">{task.dueDate?.split("T")[0]}</td>
                <td className="p-2">{task.reminderAt?.split("T")[0]}</td>
                <td className="p-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => openModal(task._id, task.status)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                No tasks found for this user.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0  flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Update Task Status</h3>

            <select
              value={newStatus}
              onChange={handleStatusChange}
              className="w-full border px-3 py-2 rounded mb-4"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={updateStatus}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTaskScreen;
