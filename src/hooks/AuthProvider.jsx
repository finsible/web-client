import {
  useContext,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import apiRequest from "../utils/apiRequest";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AUTH_STATUS_EXPIRY_SECONDS } from "../../AppContants";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

const AuthContext = createContext();
const USER_DATA_KEY = "user_data";

export const useAuthData = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthData is accessible within AuthProvider");
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // The HTTP-only cookie will be sent automatically
      // first priority is to check auth cookie
      const authCookie = document.cookie.match("is_authenticated=true");
      // if its false then no need to check in localstorage and also remove user data from localstorage
      if (!authCookie) {
        clearAuthStates();
        return;
      }
      const userData = getUserFromStorage();

      if (userData) {
        setAuthData(userData);
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        // is auth cookie is true meaning user is authenticated but localstorage is not having data
        // we fetch from backend
        await refreshUserFromBackend();
      }
    } catch (error) {
      // If request fails, user is not authenticated
      clearAuthStates();
      console.log("Not authenticated");
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    setAuthData(userData);
    setIsAuthenticated(true);
    saveUserToStorage(userData);
  };

  const getUserFromStorage = () => {
    try {
      const stored = localStorage.getItem(USER_DATA_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      localStorage.removeItem(USER_DATA_KEY);
      return null;
    }
  };

  // Save user data to localStorage
  const saveUserToStorage = (userData) => {
    try {
      // Only store safe, non-sensitive data
      const safeUserData = {
        userId: userData.userId,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        isNewUser: userData.isNewUser,
        accountCreated: userData.accountCreated,
        lastLoggedIn: userData.lastLoggedIn,
        defaultCurrencySymbol: userData.defaultCurrencySymbol,
        defaultCurrencyCode: userData.defaultCurrencyCode,
        defaultLanguageCode: userData.defaultLanguageCode,
      };

      localStorage.setItem(USER_DATA_KEY, JSON.stringify(safeUserData));
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  // Clear user data from localStorage
  const clearUserFromStorage = () => {
    localStorage.removeItem(USER_DATA_KEY);
  };

  const clearAuthStates = () => {
    setAuthData(null);
    setIsAuthenticated(false);
    clearUserFromStorage();
    navigate("/login");
    ``;
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Call logout endpoint to clear HTTP-only cookie
      const response = await apiRequest.post(API_ENDPOINTS.AUTH.SIGN_OUT);
      toast.success(response.message);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // still want to redirect to login page?
      toast.error("Could not Log out");
    } finally {
      // make the is_authenticated cookie false
      // document.cookie = `is_authenticated=false; path=/; max-age=${AUTH_STATUS_EXPIRY_SECONDS}`;
      // clearAuthStates();
      setIsLoading(false);
    }
  };

  // Force refresh user data from backend (rare use case)
  const refreshUserFromBackend = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest.get(API_ENDPOINTS.AUTH.ME);
      if (response.success) {
        const userData = response.data;
        setAuthData(userData);
        setIsAuthenticated(true);
        saveUserToStorage(userData);
        return userData;
      } else {
        // If unauthorized, clear everything
        clearAuthStates();
        return null;
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    authData,
    setAuthData,
    login,
    logout,
    isAuthenticated,
    isLoading,
    checkAuthStatus,
    refreshUserFromBackend,
    clearAuthStates,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
