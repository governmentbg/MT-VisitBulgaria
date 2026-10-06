import {apiClient} from './apiClient';
import {API_CONFIG} from './config';

/**
 * Permanently anonymize the caller's account.
 *
 * The backend will wipe PII (email, username, firstName, lastName) from
 * Keycloak, disable the account, and terminate all active sessions. The
 * Keycloak subject ID is preserved so historical records (favorites, trips)
 * remain attributable for analytics. The original email becomes available
 * for a new registration.
 *
 * After a successful call, the caller should clear local auth state
 * (`AuthContext.logoutUser`) — their tokens are already invalid server-side.
 */
export async function deleteAccount(): Promise<void> {
  await apiClient.delete(API_CONFIG.endpoints.account);
}
