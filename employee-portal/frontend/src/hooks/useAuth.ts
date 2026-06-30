import { useMutation, useQuery } from "@tanstack/react-query";
import { login as loginApi, signup as signupApi, getMe } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import type { SignupRequest } from "@/types";

export function useLogin() {
  const { setTokens, setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: async (data) => {
      setTokens(data.access_token, data.refresh_token);
      const user = await getMe();
      setUser(user);
      navigate("/");
    },
  });
}

export function useSignup() {
  const { setTokens, setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignupRequest) => signupApi(data),
    onSuccess: async (data) => {
      setTokens(data.access_token, data.refresh_token);
      const user = await getMe();
      setUser(user);
      navigate("/");
    },
  });
}

export function useCurrentUser() {
  const { setUser, accessToken } = useAuthStore();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await getMe();
      setUser(user);
      return user;
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}
