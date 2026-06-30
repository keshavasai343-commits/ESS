import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  DollarSign,
  Target,
  Users,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/attendance", icon: Clock, label: "Attendance" },
  { to: "/leave", icon: CalendarDays, label: "Leave" },
  { to: "/pay", icon: DollarSign, label: "Pay & Benefits" },
  { to: "/performance", icon: Target, label: "Performance" },
  { to: "/directory", icon: Users, label: "Directory" },
  { to: "/profile", icon: User, label: "My Profile" },
  { to: "/documents", icon: FileText, label: "Documents" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <span className="text-lg font-bold text-primary-600">ESS Portal</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
