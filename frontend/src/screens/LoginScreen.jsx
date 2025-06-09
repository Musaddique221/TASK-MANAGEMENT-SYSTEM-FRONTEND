import React, { useState } from "react";
import { BASE_URL } from "../constants/url";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [adminLogin, setAdminLogin] = useState(false);
  const [managerLogin, setManagerLogin] = useState(false);

  const navigate = useNavigate();

  const chnageHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("called");
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/login`, formData);

      if (adminLogin && data.role === "admin") {
        navigate("/admin");
      } else if (managerLogin && data.role === "manager") {
        navigate("/manager");
      } else {
        navigate(`/tasks/${data._id}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md shadow-md rounded-lg mx-auto mt-20 p-6">
      <h1 className="font-md text-2xl mb-4 text-center">
        {adminLogin
          ? "Admin Login"
          : managerLogin
          ? "Manager Login"
          : " User Login"}
      </h1>
      <form onSubmit={submitHandler}>
        <input
          className="px-4 py-2 w-full border mb-4 rounded-sm"
          placeholder="Enter email"
          name="email"
          type="email"
          onChange={chnageHandler}
          value={formData.email}
        />
        <input
          className="px-4 py-2 w-full border mb-4 rounded-sm"
          placeholder="Enter password"
          name="password"
          type="password"
          onChange={chnageHandler}
          value={formData.password}
        />
        <button
          type="submit"
          className="w-full text-center bg-blue-900 text-white rounded-sm px-4 py-2 mb-4 cursor-pointer"
        >
          Login
        </button>
      </form>

      <p className="text-center mb-2">
        Don't have account?{" "}
        <a
          className="font-bold underline hover:text-blue-900 cursor-pointer"
          href="/signup"
        >
          Signup here
        </a>
      </p>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="adminLogin"
            name="role"
            value="admin"
            checked={adminLogin}
            onChange={() => {
              setAdminLogin(true);
              setManagerLogin(false);
            }}
            className="w-4 h-4"
          />
          <label htmlFor="adminLogin" className="text-sm cursor-pointer">
            Login as Admin
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="managerLogin"
            name="role"
            value="manager"
            checked={managerLogin}
            onChange={() => {
              setManagerLogin(true);
              setAdminLogin(false);
            }}
            className="w-4 h-4"
          />
          <label htmlFor="managerLogin" className="text-sm cursor-pointer">
            Login as Manager
          </label>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
