import { useEffect, useRef, useState } from "react";
import { Bell, LogOut, Search, Award, CalendarDays, Target, X, MapPin } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { useQuery } from "@tanstack/react-query";
import { searchEmployees } from "@/api/directory";

const typeIcons: Record<string, React.ElementType> = {
  kudos: Award,
  leave: CalendarDays,
  goal: Target,
};

function timeAgo(dateStr: string) {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function useDebounce(value: string, ms: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export default function Topbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { data: notifications, dismiss } = useNotifications();
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults } = useQuery({
    queryKey: ["topbar-search", debouncedSearch],
    queryFn: () => searchEmployees({ search: debouncedSearch, per_page: 6 }),
    enabled: debouncedSearch.length >= 2,
  });

  const showSearchDrop = searchFocused && debouncedSearch.length >= 2;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToEmployee = (id: number) => {
    setSearchQuery("");
    setSearchFocused(false);
    navigate(`/directory`);
  };

  const unreadCount = notifications?.length ?? 0;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative" ref={searchRef}>
        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2 w-80">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="bg-transparent outline-none text-sm flex-1"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>

        {showSearchDrop && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
            {searchResults?.items.length ? (
              <>
                {searchResults.items.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => goToEmployee(emp.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {emp.first_name[0]}{emp.last_name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{emp.first_name} {emp.last_name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{emp.designation}</span>
                        {emp.location && (
                          <>
                            <MapPin size={10} />
                            <span>{emp.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-gray-400 flex-shrink-0">{emp.department}</span>
                  </button>
                ))}
                {searchResults.total > 6 && (
                  <button
                    onClick={() => { navigate(`/directory`); setSearchFocused(false); }}
                    className="w-full px-4 py-2.5 text-xs text-primary-600 font-medium hover:bg-gray-50 text-center"
                  >
                    View all {searchResults.total} results in Directory →
                  </button>
                )}
              </>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-400">No employees found</div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Bell */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen((o) => !o)}
            className="relative p-2 rounded-lg hover:bg-gray-100"
          >
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 rounded-full text-white text-[10px] leading-4 text-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
              <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-900 text-sm">
                Notifications
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications?.map((n) => {
                  const Icon = typeIcons[n.type] || Bell;
                  return (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 group"
                    >
                      <div className="p-1.5 bg-primary-50 rounded-lg flex-shrink-0">
                        <Icon size={14} className="text-primary-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{n.title}</p>
                        <p className="text-xs text-gray-500 truncate">{n.message}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(n.date)}</p>
                      </div>
                      <button
                        onClick={() => dismiss(n.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex-shrink-0 transition-opacity"
                        title="Dismiss"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
                {!notifications?.length && (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User */}
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
