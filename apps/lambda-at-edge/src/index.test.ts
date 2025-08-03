import { CloudFrontRequest, CloudFrontRequestEvent } from 'aws-lambda';
import { handler } from './index';

const getMockEvent = (uri = '/admin', cookie?: string) =>
  ({
    Records: [
      {
        cf: {
          request: {
            uri,
            headers: cookie ? { cookie: [{ value: cookie }] } : {},
          },
        },
      },
    ],
  }) as unknown as CloudFrontRequestEvent;

describe('WraithWatch Lambda@Edge Handler', () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should return the request for URIs', async () => {
    const event = getMockEvent('/');
    const result = await handler(event);
    expect(result).toEqual(event.Records[0].cf.request);
  });

  it('should normalize and append .html if no extension', async () => {
    const event = getMockEvent('/about');
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe('/about.html');
  });

  it('should preserve query string when adding .html', async () => {
    const event = getMockEvent('/about?foo=bar');
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe('/about.html?foo=bar');
  });

  it('should handle uri with trailing slashes', async () => {
    const event = getMockEvent('/about////');
    const result = (await handler(event)) as CloudFrontRequest;
    expect(result?.uri).toBe('/about.html');
  });
});

describe('Redirect logic for canonical domain', () => {
  const getEventWithHost = (
    uri: string,
    host: string,
    proto?: string,
    querystring?: string
  ) => {
    const headers: Record<string, Array<{ value: string }>> = {
      host: [{ value: host }],
    };
    if (proto) headers['cloudfront-forwarded-proto'] = [{ value: proto }];
    return {
      Records: [
        {
          cf: {
            request: {
              uri,
              headers,
              querystring: querystring || '',
            },
          },
        },
      ],
    } as unknown as CloudFrontRequestEvent;
  };

  it('redirects root path from wraithwatch-demo.com to www.wraithwatch-demo.com', async () => {
    const event = getEventWithHost('/', 'wraithwatch-demo.com');
    const result = await handler(event);
    expect(result).toMatchObject({
      status: '301',
      headers: {
        location: [
          {
            key: 'Location',
            value: 'https://www.wraithwatch-demo.com/',
          },
        ],
      },
    });
  });

  it('redirects subpage from wraithwatch-demo.com to www.wraithwatch-demo.com with .html', async () => {
    const event = getEventWithHost('/about', 'wraithwatch-demo.com');
    const result = await handler(event);
    expect(result).toMatchObject({
      status: '301',
      headers: {
        location: [
          {
            key: 'Location',
            value: 'https://www.wraithwatch-demo.com/about.html',
          },
        ],
      },
    });
  });

  it('redirects with query string preserved', async () => {
    const event = getEventWithHost(
      '/about',
      'wraithwatch-demo.com',
      undefined,
      'foo=bar'
    );
    const result = await handler(event);
    expect(result).toMatchObject({
      status: '301',
      headers: {
        location: [
          {
            key: 'Location',
            value: 'https://www.wraithwatch-demo.com/about.html?foo=bar',
          },
        ],
      },
    });
  });

  it('redirects with protocol from cloudfront-forwarded-proto header', async () => {
    const event = getEventWithHost('/about', 'wraithwatch-demo.com', 'http');
    const result = await handler(event);
    expect(result).toMatchObject({
      status: '301',
      headers: {
        location: [
          {
            key: 'Location',
            value: 'http://www.wraithwatch-demo.com/about.html',
          },
        ],
      },
    });
  });

  it('does not redirect for www.wraithwatch-demo.com', async () => {
    const event = getEventWithHost('/about', 'www.wraithwatch-demo.com');
    const result = await handler(event);
    expect(result).not.toHaveProperty('status', '301');
    expect((result as CloudFrontRequest).uri).toBe('/about.html');
  });

  it('redirects with default headers object when headers is undefined', async () => {
    const event = {
      Records: [
        {
          cf: {
            request: {
              uri: '/about',
              // No headers property...
            },
          },
        },
      ],
    } as unknown as CloudFrontRequestEvent;

    const result = await handler(event);
    expect((result as CloudFrontRequest).uri).toBe('/about.html');
  });

  it('redirects with default requestPath when request.uri is undefined', async () => {
    const event = {
      Records: [
        {
          cf: {
            request: {
              // No uri property...
              headers: { host: [{ value: 'wraithwatch-demo.com' }] },
            },
          },
        },
      ],
    } as unknown as CloudFrontRequestEvent;
    const result = await handler(event);
    expect(result).toMatchObject({
      status: '301',
      headers: {
        location: [
          {
            key: 'Location',
            value: 'https://www.wraithwatch-demo.com/',
          },
        ],
      },
    });
  });

  it('redirects with .html only if hasExtension is false, otherwise uses normalizedUri (hasExtension true)', async () => {
    const event = {
      Records: [
        {
          cf: {
            request: {
              uri: '/robots.txt',
              headers: { host: [{ value: 'wraithwatch-demo.com' }] },
            },
          },
        },
      ],
    } as unknown as CloudFrontRequestEvent;
    const result = await handler(event);
    expect(result).toMatchObject({
      status: '301',
      headers: {
        location: [
          {
            key: 'Location',
            value: 'https://www.wraithwatch-demo.com/robots.txt',
          },
        ],
      },
    });
  });
});
