import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { getNotifications } from "@/api/notifications";

const DISMISSED_KEY = "dismissed_notifications";

function getDismissed(): Set<string> {
  try {
    const stored = localStorage.getItem(DISMISSED_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

export function useNotifications() {
  const [dismissed, setDismissed] = useState<Set<string>>(getDismissed);

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 60 * 1000,
    select: (data) => data.filter((n) => !dismissed.has(n.id)),
  });

  const dismiss = useCallback((id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem(DISMISSED_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { ...query, dismiss };
}
