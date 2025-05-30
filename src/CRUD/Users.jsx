import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useAuth } from "../Auth/authContext";
import Api from "../api/axiossetup";

function UserForm() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState({
    userId: "",
    name: "",
    gender: "",
    role: "",
    email: "",
    password: "",
  });

  const getUsers = async () => {
    try {
      const res = await Api.get("http://localhost:5000/Users/get-User");
      setUsers(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const { userId, name, gender, role, email, password } = user;

    if (edit) {
      if (!name || !gender || !email || !password) {
        alert("Name, Gender, Email, and Password are required for update.");
        return false;
      }
    } else {
      if (!userId || !name || !gender || !role || !email || !password) {
        alert("All fields are required.");
        return false;
      }
    }

    const nameRegex = /^[A-Za-z]+(-[A-Za-z]+)*$/;
    if (!nameRegex.test(name)) {
      alert("Name should be valid!!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters!");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formatted = {
      userId: user.userId.trim(),
      name: user.name.trim(),
      gender: user.gender.trim().toLowerCase(),
      role: user.role,
      email: user.email.trim().toLowerCase(),
      password: user.password.trim(),
    };

    try {
      await Api.post("http://localhost:5000/Users/post-User", formatted);
      alert("User added successfully!");
      setUser({
        userId: "",
        name: "",
        gender: "",
        role: "",
        email: "",
        password: "",
      });
      getUsers();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    const formatted = {
      userId: user.userId.trim(),
      name: user.name.trim(),
      gender: user.gender.trim().toLowerCase(),
      role: user.role,
      email: user.email.trim().toLowerCase(),
      password: user.password.trim(),
    };

    try {
      await Api.put("http://localhost:5000/Users/put-User", formatted);
      alert("User updated successfully!");
      setUser({
        userId: "",
        name: "",
        gender: "",
        role: "",
        email: "",
        password: "",
      });
      setEdit(false);
      getUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await Api.delete("http://localhost:5000/Users/delete-User", {
        data: { userId }
      });
      alert("User deleted successfully!");
      getUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 gap-10 min-h-screen bg-gray-100">
      <div className="flex flex-col gap-4 w-full max-w-3xl bg-white p-6 rounded-xl shadow-md">
        <TextField
          label="ID"
          name="userId"
          value={user.userId}
          onChange={handleChange}
          fullWidth
          disabled={edit}
        />
        <TextField
          label="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={user.gender}
            onChange={handleChange}
            label="Gender"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth disabled={edit}>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={user.role}
            onChange={handleChange}
            label="Role"
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Super Admin">Super Admin</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          value={user.password}
          onChange={handleChange}
          fullWidth
        />
        <div className="flex justify-end gap-4">
          {edit ? (
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <TableContainer component={Paper} className="shadow-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-blue-200">
                <TableCell>User ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Gender</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Password</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u, idx) => (
                <TableRow key={idx}>
                  <TableCell>{u?.userId || ""}</TableCell>
                  <TableCell align="center">{u?.name || ""}</TableCell>
                  <TableCell align="center">{u?.gender || ""}</TableCell>
                  <TableCell align="center">{u?.role || ""}</TableCell>
                  <TableCell align="center">{u?.email || ""}</TableCell>
                  <TableCell align="center">{u?.password || ""}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setUser({ ...u });
                        setEdit(true);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(u?.userId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default UserForm;
