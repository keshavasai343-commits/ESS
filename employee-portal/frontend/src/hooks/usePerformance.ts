import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as perfApi from "@/api/performance";
import type { GoalCreate, GoalUpdate, KudosCreate } from "@/types";

export function useGoals() {
  return useQuery({
    queryKey: ["performance", "goals"],
    queryFn: perfApi.getGoals,
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GoalCreate) => perfApi.createGoal(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["performance", "goals"] }),
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GoalUpdate }) =>
      perfApi.updateGoal(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["performance", "goals"] }),
  });
}

export function useReviews() {
  return useQuery({
    queryKey: ["performance", "reviews"],
    queryFn: perfApi.getReviews,
  });
}

export function useGiveKudos() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: KudosCreate) => perfApi.giveKudos(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["performance"] }),
  });
}
