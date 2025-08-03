const urls = {
  production: 'https://www.wraithwatch-demo.com',
  test: 'http://localhost:3000',
};

const throttling = {
  production: 'simulate',
  test: 'simulate',
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
      numberOfRuns: 3,
      settings: {
        throttlingMethod: throttling[process.env.NODE_ENV] || 'devtools',
      },
      startServer: async () => {
        const execa = await import('execa');
        await execa('npm', ['run', 'dev'], { stdio: 'inherit' });
      },
      url: urls[process.env.NODE_ENV] || 'http://localhost:3000',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
