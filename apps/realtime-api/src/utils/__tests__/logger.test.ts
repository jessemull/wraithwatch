import bunyan from 'bunyan';
import { logger, createComponentLogger } from '../logger';

describe('Logger', () => {
  describe('logger', () => {
    it('should create a logger instance', () => {
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('should have the correct name', () => {
      expect(logger.fields.name).toBe('wraithwatch-api');
    });

    it('should have default level of info', () => {
      expect(logger.level()).toBe(bunyan.INFO);
    });

    it('should be able to log messages', () => {
      const mockInfo = jest.spyOn(logger, 'info').mockImplementation();
      const mockError = jest.spyOn(logger, 'error').mockImplementation();
      
      logger.info('Test info message');
      logger.error('Test error message');
      
      expect(mockInfo).toHaveBeenCalledWith('Test info message');
      expect(mockError).toHaveBeenCalledWith('Test error message');
      
      mockInfo.mockRestore();
      mockError.mockRestore();
    });
  });

  describe('createComponentLogger', () => {
    it('should create a child logger with component name', () => {
      const componentLogger = createComponentLogger('test-component');
      
      expect(componentLogger).toBeDefined();
      expect(componentLogger.fields.component).toBe('test-component');
      expect(typeof componentLogger.info).toBe('function');
      expect(typeof componentLogger.error).toBe('function');
    });

    it('should inherit from parent logger', () => {
      const componentLogger = createComponentLogger('websocket');
      
      expect(componentLogger.fields.name).toBe('wraithwatch-api');
      expect(componentLogger.fields.component).toBe('websocket');
    });

    it('should create different loggers for different components', () => {
      const logger1 = createComponentLogger('component1');
      const logger2 = createComponentLogger('component2');
      
      expect(logger1.fields.component).toBe('component1');
      expect(logger2.fields.component).toBe('component2');
      expect(logger1).not.toBe(logger2);
    });

    it('should be able to log messages with component context', () => {
      const componentLogger = createComponentLogger('websocket');
      const mockInfo = jest.spyOn(componentLogger, 'info').mockImplementation();
      
      componentLogger.info('Test message');
      
      expect(mockInfo).toHaveBeenCalledWith('Test message');
      mockInfo.mockRestore();
    });
  });

  describe('logging functionality', () => {
    it('should create loggers with different components', () => {
      const websocketLogger = createComponentLogger('websocket');
      const entityLogger = createComponentLogger('entity-manager');
      
      expect(websocketLogger.fields.component).toBe('websocket');
      expect(entityLogger.fields.component).toBe('entity-manager');
    });

    it('should maintain logger hierarchy', () => {
      const childLogger = createComponentLogger('test');
      
      expect(childLogger.fields.name).toBe('wraithwatch-api');
      expect(childLogger.fields.component).toBe('test');
    });
  });
}); 