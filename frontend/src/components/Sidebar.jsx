import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  MessageSquareCode,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: ReceiptText,
      badge: "6",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
      badge: null,
    },
    {
      name: "A/B Messages",
      path: "/messages",
      icon: MessageSquareCode,
      badge: null,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={`relative min-h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        isDark ? "border-[#12395b] bg-[#06233d] text-slate-200" : "border-sky-100 bg-[#f8fcff] text-slate-700"
      } ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header with Logo */}
      <div
        className={`flex h-20 items-center border-b ${
          isDark ? "border-[#12395b]" : "border-sky-100"
        } ${
          collapsed ? "justify-center" : "justify-between px-4"
        }`}
      >
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Reviva Logo"
              className="h-10 w-auto max-w-[140px] object-contain"
            />
          </div>
        ) : (
          <img
            src="/logo.png"
            alt="Reviva Logo"
            className="h-9 w-9 object-contain"
          />
        )}

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
            isDark
              ? "bg-[#0b3152] text-slate-200 hover:bg-[#12436c] hover:text-white"
              : "bg-sky-100 text-sky-600 hover:bg-sky-200 hover:text-sky-700"
          } ${
            collapsed ? "mt-2" : ""
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`mt-6 flex flex-col gap-1.5 ${
          collapsed ? "items-center px-2" : "px-3"
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
                  "group relative flex h-11 items-center rounded-xl font-medium text-xs transition-all duration-200",
                  collapsed ? "w-11 justify-center" : "w-full justify-between px-3.5",
                  isActive
                    ? isDark
                      ? "bg-[#0b3152] text-white border border-[#1a527f] shadow-sm font-bold"
                      : "bg-gradient-to-r from-sky-500/15 to-cyan-400/10 text-sky-700 border border-sky-200 shadow-sm font-bold"
                    : isDark
                    ? "text-slate-300 hover:bg-[#0b3152] hover:text-white"
                    : "text-slate-500 hover:bg-sky-50 hover:text-sky-700",
                ].join(" ")
              }
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={18}
                  className="shrink-0 transition-transform group-hover:scale-110"
                />

                {!collapsed && (
                  <span className="whitespace-nowrap font-semibold">
                    {item.name}
                  </span>
                )}
              </div>

              {!collapsed && item.badge && (
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200">
                  {item.badge}
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