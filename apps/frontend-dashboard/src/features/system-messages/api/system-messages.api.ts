import { queryOptions } from "@tanstack/react-query";
import { authSession } from "@/features/auth/model/auth-session";
import {
  createApiConfiguration,
  normalizeApiError,
} from "@/shared/api/api-client";
import { AdminSystemMessagesApi } from "@/shared/api/generated/v1/apis";
import type {
  CreateSystemMessageRequestDto,
  UpdateSystemMessageRequestDto,
} from "@/shared/api/generated/v1/models";

const messagesApi = new AdminSystemMessagesApi(
  createApiConfiguration(() => authSession.getToken())
);

export const systemMessagesQueryKey = ["admin", "system-messages"] as const;

export const systemMessagesQueryOptions = () =>
  queryOptions({
    queryKey: systemMessagesQueryKey,
    queryFn: async () => {
      try {
        return (await messagesApi.adminSystemMessagesList()).data;
      } catch (error) {
        throw await normalizeApiError(error);
      }
    },
  });

export async function createSystemMessage(
  payload: CreateSystemMessageRequestDto
) {
  try {
    return (
      await messagesApi.adminSystemMessagesCreate({
        createSystemMessageRequestDto: payload,
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function updateSystemMessage(
  id: string,
  payload: UpdateSystemMessageRequestDto
) {
  try {
    return (
      await messagesApi.adminSystemMessagesUpdate({
        id,
        updateSystemMessageRequestDto: payload,
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function deleteSystemMessage(id: string) {
  try {
    await messagesApi.adminSystemMessagesDelete({ id });
  } catch (error) {
    throw await normalizeApiError(error);
  }
}
