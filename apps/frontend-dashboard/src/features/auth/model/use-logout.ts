import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authSession } from "./auth-session";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return async () => {
    authSession.clear();
    queryClient.clear();
    await navigate({ to: "/login", replace: true });
  };
}
