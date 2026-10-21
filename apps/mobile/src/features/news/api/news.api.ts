import { apiRequest } from '../../../shared/api/api-client';
import type {
  NewsArticleResponseDto,
  NewsReadResponseDto,
  NewsUnreadStatusResponseDto,
} from '../../../shared/api/generated/v1';
import {
  NewsArticleResponseDtoFromJSON,
  NewsReadResponseDtoFromJSON,
} from '../../../shared/api/generated/v1';

export type NewsCategory = NewsArticleResponseDto['category'];

export type NewsArticle = NewsArticleResponseDto;

type NewsReadResult = NewsReadResponseDto;

export type NewsUnreadStatus = NewsUnreadStatusResponseDto;

export async function listNews(): Promise<NewsArticle[]> {
  const data = await apiRequest<unknown[]>('/news');
  return data.map(NewsArticleResponseDtoFromJSON);
}

export function getNewsUnreadStatus(): Promise<NewsUnreadStatus> {
  return apiRequest('/news/unread-status');
}

export async function markNewsRead(newsId: string): Promise<NewsReadResult> {
  const data = await apiRequest<unknown>(`/news/${newsId}/read`, {
    method: 'POST',
  });
  return NewsReadResponseDtoFromJSON(data);
}
