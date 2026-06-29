import api from "./client";
import type { Goal, GoalCreate, GoalUpdate, Review, Kudos, KudosCreate } from "@/types";

export const getGoals = () =>
  api.get<Goal[]>("/performance/goals").then((r) => r.data);

export const createGoal = (data: GoalCreate) =>
  api.post<Goal>("/performance/goals", data).then((r) => r.data);

export const updateGoal = (id: number, data: GoalUpdate) =>
  api.put<Goal>(`/performance/goals/${id}`, data).then((r) => r.data);

export const getReviews = () =>
  api.get<Review[]>("/performance/reviews").then((r) => r.data);

export const giveKudos = (data: KudosCreate) =>
  api.post<Kudos>("/performance/kudos", data).then((r) => r.data);
