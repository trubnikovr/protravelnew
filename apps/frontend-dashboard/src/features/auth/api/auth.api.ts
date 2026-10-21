import { queryOptions } from "@tanstack/react-query";
import {
  createApiConfiguration,
  normalizeApiError,
} from "@/shared/api/api-client";
import { AdminAuthApi, AdminProfileApi } from "@/shared/api/generated/v1/apis";
import { authSession } from "../model/auth-session";
import type { Admin, AuthResponse, LoginPayload } from "../model/auth.types";

const publicAuthApi = new AdminAuthApi(createApiConfiguration());

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await publicAuthApi.adminAuthLogin({
      adminLoginRequestDto: payload,
    });
    return response.data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function getCurrentAdmin(): Promise<Admin> {
  const profileApi = new AdminProfileApi(
    createApiConfiguration(() => authSession.getToken())
  );
  try {
    const response = await profileApi.adminProfileMe();
    return response.data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export const currentAdminQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "me"] as const,
    queryFn: getCurrentAdmin,
    staleTime: 60_000,
  });
