import { useState } from "react";
import { Search, MapPin, Mail, Phone } from "lucide-react";
import { useEmployeeSearch } from "@/hooks/useDirectory";

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useEmployeeSearch({
    search,
    department,
    page,
    per_page: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Directory</h1>
        <p className="text-gray-500 mt-1">Find colleagues across the organization</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-transparent outline-none text-sm flex-1"
            />
          </div>
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.items.map((emp) => (
              <div
                key={emp.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-lg font-semibold">
                    {emp.first_name[0]}
                    {emp.last_name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {emp.first_name} {emp.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{emp.designation}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  {emp.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{emp.location || emp.department}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {emp.department}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {data && data.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {data.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {!data?.items.length && (
            <div className="text-center py-12 text-gray-400">No employees found</div>
          )}
        </>
      )}
    </div>
  );
}
