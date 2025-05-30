import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/authContext";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const { Login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { email, password } = data;

    if (email === "" || password === "") {
      alert("Please fill all the fields");
      return;
    }

    try {
      const res = await Login(data);
      alert("Login Successfully");
      setData({ email: "", password: "" });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed");
      setData({ email: "", password: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl px-8 py-10 w-full max-w-md ">
        <TextField
          label="Email"
          type="email"
          name="email"
          value={data?.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={data?.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{
            mt: 2,
            py: 1.2,
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "8px",
          }}
        >
          Login
        </Button>

        <p className="text-center mt-4 text-gray-700">
          Don't have an account?{""}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
