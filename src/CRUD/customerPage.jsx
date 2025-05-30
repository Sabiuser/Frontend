import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Auth/authContext";
import Api from'../api/axiossetup'

function CustomerForm() {
  const {accessToken} = useAuth();
  const [task, setTask] = useState([]);
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState({
    customerId: "",
    name: "",
    gender: "",
    phone: "",
    email: "",
  });

  const getFunction = async () => {
    try {
      
      const response = await Api.get("http://localhost:5000/Customer/get-Customer"
 );
      setTask(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const ValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const ValidPhone = (phone) =>
    /^(\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/.test(phone.trim());

  const ValidName = (name) => {
    if (!name) return false;
    return /^[A-Za-z\s\-\(\)]+$/.test(name.trim());
  };

  const handleSubmit = async () => {
    const { customerId, name, gender, phone, email } = value;

    if (!customerId || !name || !gender || !phone || !email) {
      alert("Please fill in all fields.");
      return;
    }

    if (!ValidName(name)) {
      alert("Name should be valid.");
      return;
    }

    if (!ValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!ValidPhone(phone)) {
      alert("Phone number must be 10 digits.");
      return;
    }

    const formattedData = {
      customerId: customerId.trim(),
      name: name.trim(),
      gender: gender.trim(),
      phone: phone.trim(),
      email: email.trim(),
    };

    try {
      await Api.post("http://localhost:5000/Customer/post-Customer",formattedData
      );
      alert("Customer added successfully!");
      setValue({ customerId: "", name: "", gender: "", phone: "", email: "" });
      setEdit(false);
      getFunction();
    } catch (err) {
      console.error("Error posting data:", err);
    }
  };

  const handleUpdate = async () => {
    const { customerId, name, gender, phone, email } = value;

    if (!customerId || !name || !gender || !phone || !email) {
      alert("Please fill in all fields.");
      return;
    }

    if (!ValidName(name)) {
      alert("Name should be valid.");
      return;
    }

    if (!ValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!ValidPhone(phone)) {
      alert("Phone number must be 10 digits.");
      return;
    }

    const formattedData = {
      customerId: customerId.trim(),
      name: name.trim(),
      gender: gender.trim(),
      phone: phone.trim(),
      email: email.trim(),
    };

    try {
      await Api.put("http://localhost:5000/Customer/put-Customer",formattedData
       );
      alert("Customer updated successfully!");
      setValue({ customerId: "", name: "", gender: "", phone: "", email: "" });
      setEdit(false);
      getFunction();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await Api.delete("http://localhost:5000/Customer/delete-Customer", {
        data: { customerId }
        
      }
      );
      alert("Customer deleted successfully!");
      getFunction();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    getFunction();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 gap-10 min-h-screen bg-gray-100">
      <div className="flex flex-col gap-4 w-full max-w-3xl bg-white p-6 rounded-xl shadow-md">
        <TextField label="ID" name="customerId" value={value?.customerId} onChange={handleChange} variant="outlined" fullWidth disabled={edit} />
        <TextField label="Name" name="name" value={value?.name} onChange={handleChange} variant="outlined" fullWidth />
        <TextField
          select
          label="Gender"
          name="gender"
          value={value?.gender}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>
        <TextField label="Phone " name="phone" value={value?.phone} onChange={handleChange} variant="outlined" fullWidth />
        <TextField label="Email" name="email" value={value?.email} onChange={handleChange} variant="outlined" fullWidth />

        <div className="flex justify-end gap-4">
          {edit ? (
            <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <TableContainer component={Paper} className="shadow-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-pink-200 text-3xl">
                <TableCell>ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Gender</TableCell>
                <TableCell align="center">Phone</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {task.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell>{customer?.customerId || ""}</TableCell>
                  <TableCell align="center">{customer?.name || ""}</TableCell>
                  <TableCell align="center">{customer?.gender || ""}</TableCell>
                  <TableCell align="center">{customer?.phone || ""}</TableCell>
                  <TableCell align="center">{customer?.email || ""}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setValue({
                          customerId: customer?.customerId || "",
                          name: customer?.name || "",
                          gender: customer?.gender || "",
                          phone: customer?.phone || "",
                          email: customer?.email || "",
                        });
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
                      onClick={() => handleDelete(customer?.customerId)}
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

export default CustomerForm;





