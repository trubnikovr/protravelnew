import { queryOptions } from "@tanstack/react-query";
import { authSession } from "@/features/auth/model/auth-session";
import {
  createApiConfiguration,
  normalizeApiError,
} from "@/shared/api/api-client";
import { AdminNewsApi } from "@/shared/api/generated/v1/apis";
import type {
  CreateAdminNewsRequestDto,
  UpdateAdminNewsRequestDto,
} from "@/shared/api/generated/v1/models";

const newsApi = new AdminNewsApi(
  createApiConfiguration(() => authSession.getToken())
);

export const adminNewsQueryKey = ["admin", "news"] as const;

export const adminNewsQueryOptions = () =>
  queryOptions({
    queryKey: adminNewsQueryKey,
    queryFn: async () => {
      try {
        return (await newsApi.adminNewsList()).data;
      } catch (error) {
        throw await normalizeApiError(error);
      }
    },
  });

export async function createNews(payload: CreateAdminNewsRequestDto) {
  try {
    return (
      await newsApi.adminNewsCreate({ createAdminNewsRequestDto: payload })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function updateNews(
  id: string,
  payload: UpdateAdminNewsRequestDto
) {
  try {
    return (
      await newsApi.adminNewsUpdate({
        id,
        updateAdminNewsRequestDto: payload,
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function deleteNews(id: string) {
  try {
    await newsApi.adminNewsDelete({ id });
  } catch (error) {
    throw await normalizeApiError(error);
  }
}
