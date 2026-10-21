import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth.api";
import { authSession } from "./auth-session";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: async (result) => {
      authSession.setToken(result.accessToken);
      queryClient.setQueryData(["admin", "me"], result.admin);
      await navigate({ to: "/" });
    },
  });
}
