import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/employee";
import type { EmployeeUpdate } from "@/types";
import { useAuthStore } from "@/store/authStore";

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: EmployeeUpdate) => updateProfile(data),
    onSuccess: (user) => {
      setUser(user);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
