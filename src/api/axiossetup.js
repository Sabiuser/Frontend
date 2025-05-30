import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const setupAxiosInterceptors = (auth) => {
  axiosInstance.interceptors.request.use((config) => {
    const token = auth.current?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await axios.post(
            "http://localhost:5000/auth/refreshToken",
            {},
            { withCredentials: true }
          );

          const newToken = res?.data?.token;
          auth.current.setAccessToken(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log("settingQ");
          return axios({
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });

          // return axiosInstance(originalRequest);
        } catch (refreshError) {
          auth.current.setAccessToken("");
          auth.current.setUserdata(null);
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
