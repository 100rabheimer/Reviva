import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import Analytics from "./pages/Analytics";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";

function MainAppLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const isAuthPage = ["/login", "/signup", "/reset-password"].includes(location.pathname);

  if (!user && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === "/reset-password") {
    return <ResetPassword />;
  }

  if (isAuthPage) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-[#f3fbff] font-sans text-slate-900 antialiased selection:bg-sky-500 selection:text-white transition-colors duration-200">
      <Sidebar />

      <div className="min-w-0 flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/:id" element={<TransactionDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MainAppLayout />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;