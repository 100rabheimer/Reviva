import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ReceiptText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: ReceiptText,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`relative min-h-screen shrink-0 overflow-hidden bg-[#1F1F1C] text-[#F7F4EE] transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div
        className={`flex h-16 items-center ${
          collapsed ? "justify-center" : "justify-between px-4"
        }`}
      >
        {!collapsed && (
          <h2 className="whitespace-nowrap text-2xl font-semibold tracking-tight">
            Reviva
          </h2>
        )}

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition hover:bg-[#2A2A26]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`mt-8 flex flex-col gap-2 ${
          collapsed ? "items-center px-0" : "px-3"
        }`}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              title={collapsed ? item.name : ""}
              className={({ isActive }) =>
                [
                  "flex h-12 shrink-0 items-center rounded-lg transition-colors duration-200",

                  collapsed
                    ? "w-12 justify-center"
                    : "w-full gap-3 px-3",

                  isActive
                    ? "bg-[#2A2A26]"
                    : "hover:bg-[#2A2A26]",
                ].join(" ")
              }
            >
              <Icon
                size={20}
                strokeWidth={2}
                className="block shrink-0"
              />

              {!collapsed && (
                <span className="whitespace-nowrap text-sm font-medium">
                  {item.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;