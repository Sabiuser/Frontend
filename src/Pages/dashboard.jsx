import React from "react";
import { useAuth } from "../Auth/authContext";

function Dashboard() {
  const { userdata, role } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-xl w-full text-center ">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
          Welcome, <span className="text-pink-600">{userdata}</span>!
        </h1>
        <p className="text-lg text-gray-800 mb-4">
          🎉 You have successfully accessed your dashboard.
        </p>
        <div className="inline-block px-6 py-2 rounded-full bg-pink-100 text-pink-600 font-semibold shadow-md text-md">
          Logged in as: <span className="text-indigo-700">{role}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

