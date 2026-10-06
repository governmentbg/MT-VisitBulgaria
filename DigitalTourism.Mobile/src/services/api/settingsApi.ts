/**
 * Settings API — thin wrapper over the API Service's `/v1/settings/*`
 * endpoints. Used to resolve the legal page URLs configured in the
 * Payload `settings` global and to fetch the admin-configured facet
 * definitions that drive the mobile filter UI.
 *
 * @module api/settingsApi
 */

import {apiClient} from './apiClient';
import type {FacetConfigItem} from './types/searchTypes';

export interface LegalPagesResponse {
  locale: string;
  privacyPolicyPath: string | null;
  termsOfConditionsPath: string | null;
}

/**
 * Fetch the locale-specific web paths for the legal pages configured in
 * Payload CMS. The API service returns locale-agnostic paths (e.g.
 * `/privacy-policy`); the caller is expected to prepend `WEB_BASE_URL`
 * and the `/{locale}` segment, mirroring how the Next.js frontend routes.
 */
export async function getLegalPages(locale: string): Promise<LegalPagesResponse> {
  const response = await apiClient.get<LegalPagesResponse>('/v1/settings/legal-pages', {
    params: {locale},
  });
  return response.data;
}

/**
 * Fetch the admin-configured facet definitions from Payload (via the API
 * Service). Drives the mobile filter UI — ordering, enabled state,
 * `defaultExpanded`, `maxVisible`, `selectionMode`, `filterMode`.
 *
 * Backed server-side by the same `getFacetConfig()` helper the Next.js
 * frontend uses, so web and mobile stay perfectly in sync with the admin.
 */
export async function getFacetConfig(): Promise<FacetConfigItem[]> {
  const response = await apiClient.get<FacetConfigItem[]>('/v1/settings/facet-config');
  return response.data;
}
