const urls = {
  production: 'https://www.wraithwatch-demo.com',
  test: 'http://localhost:3000',
};

const throttling = {
  production: 'provided',
  test: 'provided',
};

module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
      },
    },
    collect: {
      numberOfRuns: 1,
      settings: {
        throttlingMethod: throttling[process.env.NODE_ENV] || 'devtools',
        throttling: {
          rttMs: 20,
          throughputKbps: 20480,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
        chromeFlags: '--headless --disable-gpu --no-sandbox --disable-dev-shm-usage --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding',
      },
      startServer: async () => {
        const execa = await import('execa');
        await execa('npm', ['run', 'dev'], { stdio: 'inherit' });
      },
      url: urls[process.env.NODE_ENV] || 'http://localhost:3000',
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'https://lhci-server.herokuapp.com/',
      token: process.env.LHCI_GITHUB_APP_TOKEN, origin/main
    },
  },
};
