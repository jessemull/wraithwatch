const urls = {
  production: 'https://www.wraithwatch-demo.com',
  test: 'http://localhost:3000',
};

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  ci: {
    assert: {
      assertions: {
        ...(isProduction && {
          'categories:performance': ['error', { minScore: 0.6 }],
        }),
        ...(!isProduction && {
          'categories:performance': ['warn', { minScore: 0.6 }],
        }),
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
      },
    },
    collect: {
      numberOfRuns: 1,
      ...(isProduction ? {} : {
        startServerCommand: 'yarn dev',
        startServerReadyPattern: 'started server on',
      }),
      url: urls[process.env.NODE_ENV] || 'http://localhost:3000',
      settings: {
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
          disabled: false,
        },
        throttlingMethod: 'devtools',
        onlyCategories: [
          'performance',
          'accessibility',
          'seo',
          'best-practices',
        ],
        chromeFlags:
          '--headless --disable-gpu --no-sandbox --disable-dev-shm-usage --window-size=1920,1080',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
