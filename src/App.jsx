import "./App.css";
import WelcomePage from "./components/WelcomePage";
import ThemeProvider from "./components/ThemeProvider";

function App() {
  return (
    <div>
      <ThemeProvider></ThemeProvider>
      <WelcomePage />
    </div>
  );
}

export default App;
