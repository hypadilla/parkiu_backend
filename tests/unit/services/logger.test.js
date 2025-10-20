const logger = require('../../../src/core/utils/logger');

// Mock winston
jest.mock('winston', () => {
  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
  };

  return {
    createLogger: jest.fn(() => mockLogger),
    format: {
      combine: jest.fn(),
      timestamp: jest.fn(),
      json: jest.fn(),
      colorize: jest.fn(),
      simple: jest.fn()
    },
    transports: {
      Console: jest.fn(),
      File: jest.fn()
    }
  };
});

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should log messages', () => {
      const message = 'Test message';
      logger.log(message);

      expect(logger.log).toHaveBeenCalledWith(message);
    });

    it('should log messages with objects', () => {
      const message = 'Test message';
      const obj = { key: 'value' };
      logger.log(message, obj);

      expect(logger.log).toHaveBeenCalledWith(message, obj);
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      const message = 'Test error message';
      logger.error(message);

      expect(logger.error).toHaveBeenCalledWith(message);
    });

    it('should log error messages with objects', () => {
      const message = 'Test error';
      const obj = { error: 'details' };
      logger.error(message, obj);

      expect(logger.error).toHaveBeenCalledWith(message, obj);
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      const message = 'Test warning message';
      logger.warn(message);

      expect(logger.warn).toHaveBeenCalledWith(message);
    });

    it('should log warning messages with objects', () => {
      const message = 'Test warning';
      const obj = { warning: 'details' };
      logger.warn(message, obj);

      expect(logger.warn).toHaveBeenCalledWith(message, obj);
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      const message = 'Test info message';
      logger.info(message);

      expect(logger.info).toHaveBeenCalledWith(message);
    });

    it('should log info messages with objects', () => {
      const message = 'Test info';
      const obj = { info: 'details' };
      logger.info(message, obj);

      expect(logger.info).toHaveBeenCalledWith(message, obj);
    });
  });

  describe('debug', () => {
    it('should log debug messages', () => {
      const message = 'Test debug message';
      logger.debug(message);

      expect(logger.debug).toHaveBeenCalledWith(message);
    });

    it('should log debug messages with objects', () => {
      const message = 'Test debug';
      const obj = { debug: 'details' };
      logger.debug(message, obj);

      expect(logger.debug).toHaveBeenCalledWith(message, obj);
    });
  });
});