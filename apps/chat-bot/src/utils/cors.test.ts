import { getCorsHeaders } from './cors';
import { ALLOWED_ORIGINS } from '../constants';

describe('getCorsHeaders', () => {
  const defaultOrigin = 'https://www.wraithwatch-demo.com';

  it('returns headers with the origin if it is allowed', () => {
    const allowedOrigin = ALLOWED_ORIGINS[1] || ALLOWED_ORIGINS[0];

    const headers = getCorsHeaders(allowedOrigin);
    expect(headers['Access-Control-Allow-Origin']).toBe(allowedOrigin);
    expect(headers['Access-Control-Allow-Headers']).toBe(
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    );
    expect(headers['Access-Control-Allow-Methods']).toBe('GET,POST,OPTIONS');
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('returns headers with the first allowed origin if the origin is not allowed', () => {
    const disallowedOrigin = 'https://not-allowed-origin.com';

    const headers = getCorsHeaders(disallowedOrigin);
    expect(headers['Access-Control-Allow-Origin']).toBe(ALLOWED_ORIGINS[0]);
  });

  it('returns headers with the first allowed origin if origin is empty string', () => {
    const headers = getCorsHeaders('');
    expect(headers['Access-Control-Allow-Origin']).toBe(ALLOWED_ORIGINS[0]);
  });

  it('returns headers with the first allowed origin if origin is undefined', () => {
    const headers = getCorsHeaders(undefined);
    expect(headers['Access-Control-Allow-Origin']).toBe(ALLOWED_ORIGINS[0]);
  });

  it('falls back to default origin if ALLOWED_ORIGINS is empty and origin is undefined', () => {
    const originalAllowed = [...ALLOWED_ORIGINS];
    (ALLOWED_ORIGINS as string[]).length = 0;

    const headers = getCorsHeaders(undefined);
    expect(headers['Access-Control-Allow-Origin']).toBe(defaultOrigin);

    ALLOWED_ORIGINS.splice(0, ALLOWED_ORIGINS.length, ...originalAllowed);
  });
});
