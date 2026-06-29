import api from "./client";
import type { User, EmployeeUpdate } from "@/types";

export const getProfile = () => api.get<User>("/me").then((r) => r.data);

export const updateProfile = (data: EmployeeUpdate) =>
  api.put<User>("/me", data).then((r) => r.data);
