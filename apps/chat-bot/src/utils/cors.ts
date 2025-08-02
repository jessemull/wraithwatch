import { ALLOWED_ORIGINS } from '../constants';

export function getCorsHeaders(origin?: string) {
  // For development, allow the actual origin if it's in our allowed list...
  
  const corsOrigin = ALLOWED_ORIGINS.includes(origin || '')
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin':
      corsOrigin || 'https://www.wraithwatch-demo.com',
    'Access-Control-Allow-Headers':
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json',
  };
}
