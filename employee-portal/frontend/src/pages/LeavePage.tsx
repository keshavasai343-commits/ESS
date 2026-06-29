import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDays, Plus, X } from "lucide-react";
import {
  useLeaveBalances,
  useLeaveRequests,
  useCreateLeaveRequest,
  useCancelLeaveRequest,
} from "@/hooks/useLeave";

const schema = z.object({
  leave_type: z.string().min(1, "Select leave type"),
  from_date: z.string().min(1, "Required"),
  to_date: z.string().min(1, "Required"),
  reason: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const typeColors: Record<string, string> = {
  annual: "bg-blue-100 text-blue-700",
  sick: "bg-red-100 text-red-700",
  casual: "bg-yellow-100 text-yellow-700",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function LeavePage() {
  const [showForm, setShowForm] = useState(false);
  const { data: balances, isLoading: loadingBal } = useLeaveBalances();
  const { data: requests, isLoading: loadingReq } = useLeaveRequests();
  const createReq = useCreateLeaveRequest();
  const cancelReq = useCancelLeaveRequest();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    createReq.mutate(data, {
      onSuccess: () => {
        reset();
        setShowForm(false);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-1">Track balances and manage requests</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Apply Leave"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loadingBal ? (
          <div className="col-span-3 text-center py-8 text-gray-400">Loading...</div>
        ) : (
          balances?.map((b) => (
            <div
              key={b.leave_type}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    typeColors[b.leave_type] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {b.leave_type}
                </span>
                <CalendarDays size={18} className="text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{b.remaining}</p>
              <p className="text-sm text-gray-500 mt-1">days remaining</p>
              <div className="mt-3 flex gap-4 text-xs text-gray-500">
                <span>Total: {b.total}</span>
                <span>Used: {b.used}</span>
                <span>Pending: {b.pending}</span>
              </div>
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${((b.used + b.pending) / b.total) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            New Leave Request
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type
              </label>
              <select
                {...register("leave_type")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select type</option>
                <option value="annual">Annual</option>
                <option value="sick">Sick</option>
                <option value="casual">Casual</option>
              </select>
              {errors.leave_type && (
                <p className="text-red-500 text-xs mt-1">{errors.leave_type.message}</p>
              )}
            </div>
            <div />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                {...register("from_date")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.from_date && (
                <p className="text-red-500 text-xs mt-1">{errors.from_date.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                {...register("to_date")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.to_date && (
                <p className="text-red-500 text-xs mt-1">{errors.to_date.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (optional)
              </label>
              <textarea
                {...register("reason")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={createReq.isPending}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {createReq.isPending ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Leave History</h2>
        </div>
        {loadingReq ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">From</th>
                  <th className="px-6 py-3">To</th>
                  <th className="px-6 py-3">Days</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests?.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          typeColors[r.leave_type] || ""
                        }`}
                      >
                        {r.leave_type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.from_date}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.to_date}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.days}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          statusColors[r.status] || ""
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500 max-w-[200px] truncate">
                      {r.reason || "—"}
                    </td>
                    <td className="px-6 py-3">
                      {r.status === "pending" && (
                        <button
                          onClick={() => cancelReq.mutate(r.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {!requests?.length && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                      No leave requests yet
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
