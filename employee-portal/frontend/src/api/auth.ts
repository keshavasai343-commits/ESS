import api from "./client";
import type { TokenResponse, User } from "@/types";

export const login = (email: string, password: string) =>
  api.post<TokenResponse>("/auth/login", { email, password }).then((r) => r.data);

export const getMe = () => api.get<User>("/me").then((r) => r.data);

export const refreshToken = (refresh_token: string) =>
  api.post<TokenResponse>("/auth/refresh", { refresh_token }).then((r) => r.data);
