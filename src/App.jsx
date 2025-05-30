import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/login";
import Register from "./Pages/registerpage";
import Navigation from "./Components/navbar";
import Dashboard from "./Pages/dashboard";
import CustomerForm from "./CRUD/customerPage";
import ProductForm from "./CRUD/Product";
import UserForm from "./CRUD/Users";
// hiiii
// second hii message

import { AuthProvider, useAuth } from "./Auth/authContext";

const Privaterouter = ({ children }) => {
  const { loading, isValidUser, userdata } = useAuth();
  console.log(userdata);
  if (loading) {
    return <div>Loading.....!</div>;
  }
  return userdata ? children : <Navigate to="/login"></Navigate>;
};

function AppContent() {
  const { userdata } = useAuth();

  return (
    <>
      {userdata && <Navigation />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <Privaterouter>
              <Dashboard />
            </Privaterouter>
          }
        />
        <Route
          path="/customer"
          element={
            <Privaterouter>
              <CustomerForm />
            </Privaterouter>
          }
        />
        <Route
          path="/product"
          element={
            <Privaterouter>
              <ProductForm />
            </Privaterouter>
          }
        />
        <Route
          path="/user"
          element={
            <Privaterouter>
              <UserForm />
            </Privaterouter>
          }
        />
      </Routes>
    </>
  );
}
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
