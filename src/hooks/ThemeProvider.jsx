import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Moon, Sun } from "lucide-react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default function ThemeProvider({ children }) {
  // 1. Get theme from localStorage or system
  const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme());
  const location = useLocation();
  const isLoginScreen = location.pathname === "" || location.pathname === "/login";

  // 2. Apply theme (to HTML) and save only if manually chosen
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");

    // Save only if user has manually toggled (handled below)
    if (localStorage.getItem("theme")) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // 3. Listen to system theme change (only applies if no saved preference)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const systemChangeHandler = (e) => {
      const userPreferenceExists = localStorage.getItem("theme");
      if (!userPreferenceExists) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", systemChangeHandler);
    return () => mediaQuery.removeEventListener("change", systemChangeHandler); // remove when component removed from DOM
  }, []);

  // 4. Manual toggle → force update + save preference
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next); // Save explicitly here
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{theme, isLoginScreen, toggleTheme}}>
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-2 small:top-9 mid:top-12 mid:right-4 z-10 ${isLoginScreen?"":"hidden"}`}
      >
        {theme === "dark" && (
          <div className="p-2 rounded-l hover:bg-gray-800">
            <Sun className="text-onBackground"/>
          </div>
        )}
        {theme === "light" && (
          <div className="p-2 rounded-l hover:bg-gray-300">
            <Moon/>
          </div>
        )}
      </button>
      {children}
    </ThemeContext.Provider>
  );
}
