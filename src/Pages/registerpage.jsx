import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    gender: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/register", formData);
      alert("Registered Successfully");

      setFormData({
        userId: "",
        name: "",
        gender: "",
        email: "",
        password: "",
        role: "",
      });
    } catch (err) {
      alert("Error occurred!!");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: 300,
        margin: "auto",
        marginTop: "50px",
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <h2>Register</h2>
      <TextField
        name="userId"
        label="User ID"
        value={formData?.userId}
        onChange={handleChange}
        fullWidth
        required
      />

      <TextField
        name="name"
        label="Name"
        value={formData?.name}
        onChange={handleChange}
        fullWidth
        required
      />
      <FormControl fullWidth required>
        <InputLabel>Gender</InputLabel>
        <Select
          name="gender"
          value={formData?.gender}
          label="Gender"
          onChange={handleChange}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name="email"
        label="Email"
        type="email"
        value={formData?.email}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        value={formData?.password}
        onChange={handleChange}
        fullWidth
        required
      />
      <FormControl fullWidth required>
        <InputLabel>Role</InputLabel>
        <Select
          name="role"
          value={formData?.role}
          label="Role"
          onChange={handleChange}
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Super Admin">Super Admin</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" fullWidth>
        Register
      </Button>
    </Box>
  );
}

export default Register;
