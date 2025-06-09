import React, { useEffect, useState } from "react";
import axios from "axios";
import UserModal from "./UserModal";
import TaskModal from "./TaskModal";
import { BASE_URL } from "../constants/url";
import { toast } from "react-toastify";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/auth/users`);
      setUsers(data.users || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch users");
    }
  };

  const handleCreateTask = (user) => {
    setSelectedUser(user);
    setShowTaskModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.delete(`${BASE_URL}/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <table className="w-full border text-left mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">User Role </th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">{user.userRole} </td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleCreateTask(user)}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Create Task
                </button>
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showTaskModal && selectedUser && (
        <TaskModal user={selectedUser} onClose={() => setShowTaskModal(false)} />
      )}

      {showUserModal && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setSelectedUser(null);
            setShowUserModal(false);
            fetchUsers();
          }}
        />
      )}
    </>
  );
};

export default UsersTable;
