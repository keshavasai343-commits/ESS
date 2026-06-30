import { Clock, LogIn, LogOut, CalendarCheck, Timer } from "lucide-react";
import {
  useTodayAttendance,
  useAttendanceHistory,
  useAttendanceSummary,
  useClockIn,
  useClockOut,
} from "@/hooks/useAttendance";

const statusColors: Record<string, string> = {
  present: "bg-green-100 text-green-700",
  late: "bg-yellow-100 text-yellow-700",
  half_day: "bg-orange-100 text-orange-700",
};

function formatTime(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function AttendancePage() {
  const { data: today, isLoading: loadingToday } = useTodayAttendance();
  const { data: history, isLoading: loadingHistory } = useAttendanceHistory();
  const { data: summary } = useAttendanceSummary();
  const clockIn = useClockIn();
  const clockOut = useClockOut();

  const hasClockedIn = !!today?.clock_in;
  const hasClockedOut = !!today?.clock_out;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-500 mt-1">Clock in and track your working hours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Today</h2>
            <span className="text-sm text-gray-400 ml-auto">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          {loadingToday ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-600 font-medium">Clock In</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {formatTime(today?.clock_in)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-purple-600 font-medium">Clock Out</p>
                  <p className="text-2xl font-bold text-purple-700 mt-1">
                    {formatTime(today?.clock_out)}
                  </p>
                </div>
              </div>

              {today?.status && (
                <div className="mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[today.status] || "bg-gray-100 text-gray-600"}`}>
                    {today.status.replace("_", " ")}
                  </span>
                  {today.total_hours != null && (
                    <span className="text-sm text-gray-500 ml-3">
                      {today.total_hours} hrs logged
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => clockIn.mutate()}
                  disabled={hasClockedIn || clockIn.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <LogIn size={18} />
                  {clockIn.isPending ? "Clocking in..." : "Clock In"}
                </button>
                <button
                  onClick={() => clockOut.mutate()}
                  disabled={!hasClockedIn || hasClockedOut || clockOut.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <LogOut size={18} />
                  {clockOut.isPending ? "Clocking out..." : "Clock Out"}
                </button>
              </div>

              {(clockIn.isError || clockOut.isError) && (
                <p className="text-red-500 text-sm mt-3 text-center">
                  {((clockIn.error || clockOut.error) as any)?.response?.data?.detail || "Something went wrong"}
                </p>
              )}
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CalendarCheck size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{summary?.days_present ?? "—"}</p>
                <p className="text-xs text-gray-500">Days present this month</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Timer size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{summary?.avg_hours ?? "—"}</p>
                <p className="text-xs text-gray-500">Avg. hours / day</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">History</h2>
        </div>
        {loadingHistory ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Clock In</th>
                  <th className="px-6 py-3">Clock Out</th>
                  <th className="px-6 py-3">Hours</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history?.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{rec.date}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{formatTime(rec.clock_in)}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{formatTime(rec.clock_out)}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{rec.total_hours ?? "—"}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[rec.status] || "bg-gray-100 text-gray-600"}`}>
                        {rec.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
                {!history?.length && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No attendance records yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
