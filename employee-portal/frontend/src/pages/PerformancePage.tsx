import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Target, Star, Award, Plus, X } from "lucide-react";
import { useGoals, useCreateGoal, useUpdateGoal, useReviews } from "@/hooks/usePerformance";

const goalSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  category: z.string().optional(),
  due_date: z.string().optional(),
});

type GoalForm = z.infer<typeof goalSchema>;

const categoryColors: Record<string, string> = {
  technical: "bg-blue-100 text-blue-700",
  leadership: "bg-purple-100 text-purple-700",
  personal: "bg-green-100 text-green-700",
};

export default function PerformancePage() {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const { data: goals } = useGoals();
  const { data: reviews } = useReviews();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
  });

  const onSubmit = (data: GoalForm) => {
    createGoal.mutate(data, {
      onSuccess: () => {
        reset();
        setShowGoalForm(false);
      },
    });
  };

  const handleProgressChange = (goalId: number, progress: number) => {
    updateGoal.mutate({ id: goalId, data: { progress } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance</h1>
          <p className="text-gray-500 mt-1">Track goals and view feedback</p>
        </div>
        <button
          onClick={() => setShowGoalForm(!showGoalForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {showGoalForm ? <X size={18} /> : <Plus size={18} />}
          {showGoalForm ? "Cancel" : "Add Goal"}
        </button>
      </div>

      {showGoalForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Goal</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                {...register("title")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea {...register("description")} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select {...register("category")} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select</option>
                <option value="technical">Technical</option>
                <option value="leadership">Leadership</option>
                <option value="personal">Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" {...register("due_date")} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <button type="submit" disabled={createGoal.isPending} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                {createGoal.isPending ? "Creating..." : "Create Goal"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">My Goals</h2>
          </div>
          {goals?.map((goal) => (
            <div key={goal.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  {goal.description && <p className="text-sm text-gray-500 mt-0.5">{goal.description}</p>}
                </div>
                {goal.category && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[goal.category] || "bg-gray-100 text-gray-600"}`}>
                    {goal.category}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-semibold text-gray-700">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${goal.progress >= 100 ? "bg-green-500" : "bg-primary-500"}`}
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  />
                </div>
                {goal.status !== "completed" && (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => handleProgressChange(goal.id, Number(e.target.value))}
                    className="w-full mt-2 accent-primary-600"
                  />
                )}
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                {goal.due_date && <span>Due: {goal.due_date}</span>}
                <span className={`capitalize ${goal.status === "completed" ? "text-green-600" : goal.status === "overdue" ? "text-red-600" : "text-yellow-600"}`}>
                  {goal.status.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star size={20} className="text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">Manager Reviews</h2>
            </div>
            {reviews?.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{r.period}</p>
                    <p className="text-xs text-gray-500">by {r.reviewer_name}</p>
                  </div>
                  {r.rating && (
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-900">{r.rating}</span>
                      <span className="text-xs text-gray-400">/5</span>
                    </div>
                  )}
                </div>
                {r.strengths && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-green-600 mb-0.5">Strengths</p>
                    <p className="text-sm text-gray-700">{r.strengths}</p>
                  </div>
                )}
                {r.improvements && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-orange-600 mb-0.5">Areas for Improvement</p>
                    <p className="text-sm text-gray-700">{r.improvements}</p>
                  </div>
                )}
                {r.comments && <p className="text-sm text-gray-500 italic">"{r.comments}"</p>}
              </div>
            ))}
            {!reviews?.length && (
              <p className="text-sm text-gray-400">No reviews yet</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award size={20} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Peer Kudos</h2>
            </div>
            <p className="text-sm text-gray-400">Kudos will appear here once received.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
