import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { useAuth } from "../Auth/authContext";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const { Logout, role } = useAuth();
  const navigate = useNavigate();

  const handlelogout = async () => {
    await Logout();
    navigate("/login");
  };

  return (
    <nav className="flex flex-wrap justify-between items-center h-[70px] w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 shadow-lg px-6 py-2 z-50">
      <div className="text-2xl font-extrabold text-white hover:text-yellow-400 transition duration-300">
        <Link to="/">🚀 My Dashboard</Link>
      </div>

      <div className="flex items-center gap-5">
        <Link
          to="/customer"
          className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300 hover:underline underline-offset-4"
        >
          Customer
        </Link>
        <Link
          to="/product"
          className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300 hover:underline underline-offset-4"
        >
          Product
        </Link>

        {role === "Super Admin" && (
          <Link
            to="/user"
            className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300 hover:underline underline-offset-4"
          >
            Users
          </Link>
        )}

        <Button
          variant="contained"
          color="error"
          onClick={handlelogout}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "10px",
            padding: "6px 20px",
            
            
            
            
              
            
          }}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;


