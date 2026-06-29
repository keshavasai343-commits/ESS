import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as leaveApi from "@/api/leave";
import type { LeaveRequestCreate } from "@/types";

export function useLeaveBalances() {
  return useQuery({
    queryKey: ["leave", "balances"],
    queryFn: leaveApi.getLeaveBalances,
  });
}

export function useLeaveRequests() {
  return useQuery({
    queryKey: ["leave", "requests"],
    queryFn: leaveApi.getLeaveRequests,
  });
}

export function useCreateLeaveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LeaveRequestCreate) => leaveApi.createLeaveRequest(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leave"] });
    },
  });
}

export function useCancelLeaveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => leaveApi.cancelLeaveRequest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leave"] });
    },
  });
}
