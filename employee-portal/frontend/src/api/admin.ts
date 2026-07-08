import api from "./client";
import type { User } from "@/types";

export interface CreateUserPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  department: string;
  designation: string;
  role: string;
  phone?: string;
  location?: string;
}

export const listUsers = (search = "") =>
  api.get<User[]>("/admin/users", { params: { search } }).then((r) => r.data);

export const createUser = (payload: CreateUserPayload) =>
  api.post<User>("/admin/users", payload).then((r) => r.data);

export const toggleUser = (id: number) =>
  api.patch<User>(`/admin/users/${id}/toggle`).then((r) => r.data);
