import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as attendanceApi from "@/api/attendance";

export function useTodayAttendance() {
  return useQuery({
    queryKey: ["attendance", "today"],
    queryFn: attendanceApi.getTodayAttendance,
  });
}

export function useAttendanceHistory() {
  return useQuery({
    queryKey: ["attendance", "history"],
    queryFn: attendanceApi.getAttendanceHistory,
  });
}

export function useAttendanceSummary() {
  return useQuery({
    queryKey: ["attendance", "summary"],
    queryFn: attendanceApi.getAttendanceSummary,
  });
}

export function useClockIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.clockIn,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["attendance"] }),
  });
}

export function useClockOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.clockOut,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["attendance"] }),
  });
}
