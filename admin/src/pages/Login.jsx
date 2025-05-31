import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BASE_URL from "../config";
const url = `${BASE_URL}`;
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save JWT token in sessionStorage
        sessionStorage.setItem("adminToken", data.token);
        toast.success("Login successful!");
        navigate("/add-song");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Network error, please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 sm:p-12 text-gray-800">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
          Rythmiq Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="admin@rythmiq.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold text-lg transition hover:opacity-90"
          >
            Login
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">
          Only authorized admins are allowed access.
        </p>
      </div>
    </div>
  );
};

export default Login;
