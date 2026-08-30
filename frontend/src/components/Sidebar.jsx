import { NavLink } from "react-router-dom";
function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#1F1F1C] text-[#F7F4EE] p-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        Reviva
      </h2>

      <nav className="mt-10 space-y-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block w-full rounded-lg px-3 py-2 ${
              isActive ? "bg-[#2A2A26]" : "hover:bg-[#2A2A26]"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `block w-full rounded-lg px-3 py-2 ${
              isActive ? "bg-[#2A2A26]" : "hover:bg-[#2A2A26]"
            }`
          }
        >
          Transactions
        </NavLink>

        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2A2A26]">
          Settings
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;