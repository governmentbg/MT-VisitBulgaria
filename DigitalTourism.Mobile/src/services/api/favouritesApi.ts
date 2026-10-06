/**
 * Favourites API Service
 *
 * Communicates with the .NET API Service at /v1/favorites.
 * The API Service handles Payload CMS visitor token exchange and data transformation.
 */

import {apiClient} from './apiClient';
import {API_CONFIG} from './config';
import {resolveMediaUrl} from './transforms/payloadHelpers';
import type {
  Favourite,
  FavouriteItem,
  FavouriteExperienceType,
} from '../../models/Favourite';

/** Response shape from the API Service favorites endpoint */
interface ApiFavoritesResponse {
  data: Array<{
    id: string;
    favoriteId: number;
    title: string;
    type: string;
    imageUrl: string;
    imageAlt: string;
    cityName?: string;
    categories?: string[];
    starRating?: number;
    startDate?: string;
    endDate?: string;
    latitude?: number;
    longitude?: number;
  }>;
}

interface ApiAddFavoriteResponse {
  id: number;
  relationTo: string;
  experienceId: number;
}

/**
 * Map an API Service favorite item to the app's FavouriteItem model.
 */
function toFavouriteItem(item: ApiFavoritesResponse['data'][0]): FavouriteItem {
  return {
    id: item.id,
    favouriteId: item.favoriteId,
    title: item.title,
    type: item.type as FavouriteExperienceType,
    imageUrl: resolveMediaUrl(item.imageUrl),
    imageAlt: item.imageAlt,
    cityName: item.cityName,
    categories: item.categories,
    starRating: item.starRating,
    startDate: item.startDate,
    endDate: item.endDate,
    latitude: item.latitude,
    longitude: item.longitude,
  };
}

export const favouritesApi = {
  /**
   * Fetch all favourites for the current user.
   * The API Service returns pre-transformed FavouriteItem data.
   */
  async getAll(): Promise<FavouriteItem[]> {
    const response = await apiClient.get<ApiFavoritesResponse>(
      API_CONFIG.endpoints.favorites,
    );
    return response.data.data.map(toFavouriteItem);
  },

  /**
   * Add a favourite.
   */
  async add(
    relationTo: FavouriteExperienceType,
    experienceId: number,
  ): Promise<Favourite> {
    const response = await apiClient.post<ApiAddFavoriteResponse>(
      API_CONFIG.endpoints.favorites,
      {relationTo, experienceId},
    );
    // Return a minimal Favourite object matching the expected interface
    return {
      id: response.data.id,
      visitor: 0,
      experience: {relationTo, value: experienceId},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Remove a favourite by its document ID.
   */
  async remove(favouriteId: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.endpoints.favorites}/${favouriteId}`);
  },
};
