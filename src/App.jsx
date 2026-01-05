import ThemeProvider from "./hooks/ThemeProvider";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomePage from "./pages/WelcomePage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import AuthProvider from "./hooks/AuthProvider";
import { SidebarProvider } from "./hooks/SidebarProvider";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<WelcomePage />} />

              {/* Protected routes */}

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/accounts"
                element={
                  <ProtectedRoute>
                    <Accounts />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          {/* Other components that might need Google OAuth */}
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
