import React from "react";

import { Route, Routes } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import AdminScreen from "./screens/AdminScreen";
import UserTaskScreen from "./screens/UserTaskScreen";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/:name" element={<AdminScreen />} />
        <Route path="/tasks/:id" element={<UserTaskScreen />} />
      </Routes>
    </div>
  );
};

export default App;
