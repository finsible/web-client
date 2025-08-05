import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ThemeProvider from "./components/ThemeProvider.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
