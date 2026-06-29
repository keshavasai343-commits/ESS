import { useQuery } from "@tanstack/react-query";
import * as dirApi from "@/api/directory";

export function useEmployeeSearch(params: {
  search?: string;
  department?: string;
  page?: number;
  per_page?: number;
}) {
  return useQuery({
    queryKey: ["directory", params],
    queryFn: () => dirApi.searchEmployees(params),
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ["directory", "employee", id],
    queryFn: () => dirApi.getEmployee(id),
    enabled: !!id,
  });
}
