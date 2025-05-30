import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import axiosInstance, { setupAxiosInterceptors } from "../api/axiossetup";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const Logout = useCallback(async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      console.log("Logout: Clearing user session.");
      setUserdata(null);
      setAccessToken("");
      setRole("");
      axiosInstance.defaults.headers.common.Authorization = "";
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      setLoading(true);
      console.log("AuthContext: Refreshing token...");
      const res = await axios.post(
        "http://localhost:5000/auth/refreshToken",
        {},
        {
          withCredentials: true,
        }
      );

      const token = res?.data?.token || "";
      const user = res?.data?.user || null;
      const userRole = res?.data?.role || "";

      setAccessToken(token);
      setUserdata(user);
      setRole(userRole);

      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error("Refresh failed:", err);
      Logout();
    } finally {
      setLoading(false);
      console.log("AuthContext: Token refresh complete.");
    }
  }, [Logout]);

  const Login = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        data,
        {
          withCredentials: true,
        }
      );

      const token = response?.data?.token || "";
      const user = response?.data?.user || null;
      const userRole = response?.data?.role || "";

      setAccessToken(token);
      setUserdata(user);
      setRole(userRole);

      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      return !!(token && user && userRole);
    } catch (error) {
      console.error("Login failed:", error);
      setAccessToken("");
      setUserdata(null);
      setRole("");
      axiosInstance.defaults.headers.common.Authorization = "";
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const authRef = useRef({
    accessToken,
    setAccessToken,
    setUserdata,
    Logout,
  });

  useEffect(() => {
    authRef.current.accessToken = accessToken;
    authRef.current.setAccessToken = setAccessToken;
    authRef.current.setUserdata = setUserdata;
    authRef.current.Logout = Logout;
  }, [accessToken, Logout]);

  useEffect(() => {
    console.log("AuthContext: Running initial token check.");
    refreshToken();
    setupAxiosInterceptors(authRef);
  }, [refreshToken]);
  // useEffect(() => {
  //   console.log("AuthContext: Setting up Axios Interceptors.");
  //   setupAxiosInterceptors(authRef);
  // }, []);

  const isValidUser = !!accessToken && !!userdata;

  return (
    <AuthContext.Provider
      value={{
        Login,
        Logout,
        refreshToken,
        accessToken,
        userdata,
        isValidUser,
        loading,
        role,
      }}
    >
      {!loading ? (
        children
      ) : (
        <div className="p-6 flex items-center justify-center text-xl font-semibold">
          Authenticating...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
