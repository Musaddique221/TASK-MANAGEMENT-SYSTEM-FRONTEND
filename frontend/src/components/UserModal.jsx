import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/url";
import { toast } from "react-toastify";

const UserModal = ({ user, onClose }) => {
  console.log(onClose, 7);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    role: user.role || "user",
    userRole: user.userRole || "promote",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    console.log("clicked");
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log(userInfo, "22");
      const { data } = await axios.put(
        `${BASE_URL}/auth/users/${user._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );
      console.log(data, "24");
      toast.success("User updated successfully");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <div className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>

          <select
            name="userRole"
            value={formData.userRole}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="promote">Promote</option>
            <option value="demote">Demote</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
