import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="flex min-h-screen bg-[#F7F4EE]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/transactions"
            element={<Transactions />}
          />

          <Route
            path="/transactions/:id"
            element={<TransactionDetail />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;