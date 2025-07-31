import bunyan from 'bunyan';

export const logger = bunyan.createLogger({
  name: 'wraithwatch-api',
  level: (process.env.LOG_LEVEL as bunyan.LogLevel) || 'info',
  serializers: bunyan.stdSerializers,
  streams: [
    {
      level: 'info',
      stream: process.stdout,
    },
    {
      level: 'error',
      stream: process.stderr,
    },
  ],
});

// Create child loggers for different components
export const createComponentLogger = (component: string) => {
  return logger.child({ component });
}; 