import { useEffect, useState } from "react";
import sunImage from "../assets/Sun Vector Icon.svg";
import moonImage from "../assets/Moon Vector Icon.svg";

export default function ThemeProvider({ children }) {
  // 1. Get theme from localStorage or system
  const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

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
    <>
      <button onClick={toggleTheme} className="fixed top-6 right-2 small:top-8 mid:top-12 mid:right-5 z-10">
        {theme === "dark" && (
          <div className="p-2 rounded-l hover:bg-gray-800">
            <img src={sunImage} className="w-6 small:w-7"/>
          </div>
        )}
        {theme === "light" && (
          <div className="p-2 rounded-l hover:bg-gray-300">
            <img src={moonImage} className="w-6 small:w-7"/>
          </div>
        )}
      </button>
      {children}
    </>
  );
}
