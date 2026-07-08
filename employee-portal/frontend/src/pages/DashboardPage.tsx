import {
  CalendarDays,
  IndianRupee,
  Target,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLeaveBalances } from "@/hooks/useLeave";
import { useGoals } from "@/hooks/usePerformance";
import { Link } from "react-router-dom";

const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: balances } = useLeaveBalances();
  const { data: goals } = useGoals();

  const totalLeave = balances?.reduce((sum, b) => sum + b.remaining, 0) ?? 0;
  const activeGoals = goals?.filter((g) => g.status === "in_progress").length ?? 0;

  const stats = [
    {
      label: "Leave Balance",
      value: `${totalLeave} days`,
      icon: CalendarDays,
      color: "bg-blue-50 text-blue-600",
      link: "/leave",
    },
    {
      label: "Net Pay (Jun)",
      value: inr(126400),
      icon: IndianRupee,
      color: "bg-green-50 text-green-600",
      link: "/pay",
    },
    {
      label: "Active Goals",
      value: activeGoals.toString(),
      icon: Target,
      color: "bg-purple-50 text-purple-600",
      link: "/performance",
    },
    {
      label: "Team Size",
      value: "5",
      icon: Users,
      color: "bg-orange-50 text-orange-600",
      link: "/directory",
    },
  ];

  const announcements = [
    {
      title: "Office Closed — Independence Day",
      date: "Aug 15, 2026",
      type: "Holiday",
    },
    {
      title: "Office Closed — Raksha Bandhan",
      date: "Aug 28, 2026",
      type: "Holiday",
    },
    {
      title: "Open Enrollment for Mediclaim Policy",
      date: "Jul 1–15, 2026",
      type: "Benefits",
    },
    {
      title: "Q2 All-Hands Meeting",
      date: "Jul 10, 2026",
      type: "Event",
    },
  ];

  const schedule = [
    { time: "9:00 AM", event: "Team standup", type: "Meeting" },
    { time: "11:00 AM", event: "Design review — Mobile app", type: "Review" },
    { time: "2:00 PM", event: "1:1 with Sarah Chen", type: "Meeting" },
    { time: "4:00 PM", event: "Sprint planning", type: "Planning" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.first_name}
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening today, {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={22} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Announcements</h2>
          </div>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.title}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500">
                    {a.date} · {a.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
          </div>
          <div className="space-y-3">
            {schedule.map((s) => (
              <div
                key={s.time}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
              >
                <span className="text-sm font-mono text-gray-500 w-20">
                  {s.time}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.event}</p>
                  <p className="text-xs text-gray-500">{s.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/leave"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow text-center"
        >
          <CalendarDays className="mx-auto text-blue-600 mb-2" size={28} />
          <p className="font-medium text-gray-900">Apply for Leave</p>
          <p className="text-xs text-gray-500 mt-1">Request time off</p>
        </Link>
        <Link
          to="/pay"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow text-center"
        >
          <IndianRupee className="mx-auto text-green-600 mb-2" size={28} />
          <p className="font-medium text-gray-900">View Payslip</p>
          <p className="text-xs text-gray-500 mt-1">Latest pay details</p>
        </Link>
        <Link
          to="/documents"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow text-center"
        >
          <Target className="mx-auto text-purple-600 mb-2" size={28} />
          <p className="font-medium text-gray-900">Upload Document</p>
          <p className="text-xs text-gray-500 mt-1">PAN, Aadhaar, Form 16, certificates</p>
        </Link>
      </div>
    </div>
  );
}
