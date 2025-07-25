import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

    
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, name, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        name,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error signing up", // ✅ Fixed: Added optional chaining
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
   
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

       
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
      
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (verificationCode) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Verifying email with code:", verificationCode); // Debugging log
      const response = await axios.post(`${API_URL}/verify-email`, {
        verificationCode,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      //? ปกติ เมื่อคืนค่าแล้วจะไม่ต้อง return อะไร แต่ถ้าต้องการให้มีค่า return ก็สามารถทำได้
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email", // ✅ Fixed: Added optional chaining
        isLoading: false,
      });
      throw error;
    }
  },

  

  checkAuth: async () => {
    // หน่วยเวลาการตรวจสอบการยืนยันตัวตน
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay

    set({ isCheckingAuth: true, error: null });
    try {
       const response = await axios.get(`${API_URL}/check-auth`);
     
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email", // ✅ Fixed: Added optional chaining
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password", // ✅ Fixed: Added optional chaining
      });
      throw error;
    }
  },
}));
