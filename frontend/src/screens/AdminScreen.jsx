import React from "react";
import AdminDashboard from "../components/AdminDashboard";
import { useParams } from "react-router-dom";

const AdminScreen = () => {
  const { name } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 capitalize">
        {name} Dashboard
      </h1>
      <AdminDashboard />
    </div>
  );
};

export default AdminScreen;
