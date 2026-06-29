import api from "./client";
import type { PaginatedEmployees, User } from "@/types";

export const searchEmployees = (params: {
  search?: string;
  department?: string;
  page?: number;
  per_page?: number;
}) => api.get<PaginatedEmployees>("/directory/employees", { params }).then((r) => r.data);

export const getEmployee = (id: number) =>
  api.get<User>(`/directory/employees/${id}`).then((r) => r.data);
