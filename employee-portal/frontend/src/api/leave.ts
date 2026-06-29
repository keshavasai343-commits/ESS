import api from "./client";
import type { LeaveBalance, LeaveRequest, LeaveRequestCreate } from "@/types";

export const getLeaveBalances = () =>
  api.get<LeaveBalance[]>("/leave/balances").then((r) => r.data);

export const getLeaveRequests = () =>
  api.get<LeaveRequest[]>("/leave/requests").then((r) => r.data);

export const createLeaveRequest = (data: LeaveRequestCreate) =>
  api.post<LeaveRequest>("/leave/requests", data).then((r) => r.data);

export const cancelLeaveRequest = (id: number) =>
  api.put<LeaveRequest>(`/leave/requests/${id}/cancel`).then((r) => r.data);
