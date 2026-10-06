/**
 * Activities API Service
 *
 * Communicates with the .NET API Service at /v1/activities.
 */

import {createEntityApi} from './createEntityApi';
import {API_CONFIG} from './config';
import {
  transformPayloadActivityToApp,
  transformPayloadActivitiesToApp,
} from './transforms';
import type {Activity} from '../../models/Activity';
import type {ApiActivityDto} from './types/apiServiceTypes';

export const activitiesApi = createEntityApi<Activity, ApiActivityDto>({
  endpoint: API_CONFIG.endpoints.activities,
  transformOne: transformPayloadActivityToApp,
  transformMany: transformPayloadActivitiesToApp,
});
