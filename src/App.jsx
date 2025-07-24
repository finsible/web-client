import { GoogleOAuthProvider } from "@react-oauth/google";
import WelcomePage from "./components/WelcomePage";
import ThemeProvider from "./components/ThemeProvider";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId="353640413518-5nqljv0ar8qn7k880qdtkodtamts26t9.apps.googleusercontent.com">
        <div>
          <ThemeProvider></ThemeProvider>
          <WelcomePage />
          {/* Other components that might need Google OAuth */}
        </div>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
