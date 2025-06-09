import React, { useState } from "react";
import UsersTable from "./UsersTable";
import TasksTable from "./TasksTable"; // You'll need to create this component

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-48 bg-gray-100 border-r">
        <div className="flex flex-col">
          <button
            onClick={() => setActiveTab("users")}
            className={`p-4 text-left hover:bg-gray-200 ${
              activeTab === "users" ? "bg-gray-300 font-semibold" : ""
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`p-4 text-left hover:bg-gray-200 ${
              activeTab === "tasks" ? "bg-gray-300 font-semibold" : ""
            }`}
          >
            Tasks
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {activeTab === "users" && <UsersTable />}
        {activeTab === "tasks" && <TasksTable />}
      </div>
    </div>
  );
};

export default AdminDashboard;
