import api from "./client";
import type { Attendance, AttendanceSummary } from "@/types";

export const getTodayAttendance = () =>
  api.get<Attendance | null>("/attendance/today").then((r) => r.data);

export const getAttendanceHistory = () =>
  api.get<Attendance[]>("/attendance/history").then((r) => r.data);

export const getAttendanceSummary = () =>
  api.get<AttendanceSummary>("/attendance/summary").then((r) => r.data);

export const clockIn = () =>
  api.post<Attendance>("/attendance/clock-in").then((r) => r.data);

export const clockOut = () =>
  api.post<Attendance>("/attendance/clock-out").then((r) => r.data);
