const urls = {
  production: 'https://www.wraithwatch-demo.com',
  test: 'http://localhost:3000',
};

module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
      },
    },
    collect: {
      numberOfRuns: 1,
      settings: {
        throttlingMethod: 'provided',
        onlyCategories: [
          'performance',
          'accessibility',
          'seo',
          'best-practices',
        ],
        disableStorageReset: true,
        emulatedFormFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
          disabled: false,
        },
        throttling: {
          rttMs: 0,
          throughputKbps: 0,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        chromeFlags:
          '--headless --disable-gpu --no-sandbox --disable-dev-shm-usage --window-size=1920,1080',
      },
      startServer: async () => {
        const execa = await import('execa');
        await execa('npm', ['run', 'dev'], { stdio: 'inherit' });
      },
      url: urls[process.env.NODE_ENV] || 'http://localhost:3000',
    },
    upload: {
      target: 'none',
    },
  },
};
