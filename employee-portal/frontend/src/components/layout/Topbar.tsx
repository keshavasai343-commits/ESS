import { Bell, LogOut, Search } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2 w-80">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm flex-1"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500">{user?.designation}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
