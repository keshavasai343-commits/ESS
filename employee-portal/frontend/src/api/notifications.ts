import api from "./client";
import type { Notification } from "@/types";

export const getNotifications = () =>
  api.get<Notification[]>("/notifications").then((r) => r.data);
