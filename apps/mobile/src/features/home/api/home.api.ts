import { API_BASE_URL, apiRequest } from '../../../shared/api/api-client';

export type Money = {
  amount: string;
  currency: 'RUB' | 'USD' | 'EUR';
  formatted: string;
};

export type HomeTour = {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: Money;
  imageUrl: string | null;
  hotelCategory: number | null;
};

export type HomeDestination = {
  id: string;
  title: string;
  subtitle: string;
  fromPrice: Money;
  imageUrl: string | null;
};

export type HomeContent = {
  recommended: HomeTour[];
  popularDestinations: HomeDestination[];
  hotTours: HomeTour[];
};

export function getHomeContent(): Promise<HomeContent> {
  return apiRequest('/home');
}

export function transformedImageUrl(source: string): string {
  const query = `src=${encodeURIComponent(source)}&preset=home-card`;
  return `${API_BASE_URL}/files/image-transform?${query}`;
}
