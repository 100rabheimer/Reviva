import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";

function App() {
  return (
    <div className="flex min-h-screen bg-[#F7F4EE]">
      <Sidebar />

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
      </Routes>
    </div>
  );
}

export default App;