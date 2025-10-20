const logger = require('../../../src/core/utils/logger');

// Mock console methods
const originalConsole = global.console;
const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

beforeAll(() => {
  global.console = mockConsole;
});

afterAll(() => {
  global.console = originalConsole;
});

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should log info messages', () => {
      const message = 'Test info message';
      logger.log(message);

      expect(mockConsole.log).toHaveBeenCalledWith(message);
    });

    it('should log messages with objects', () => {
      const message = 'Test message';
      const obj = { key: 'value' };
      logger.log(message, obj);

      expect(mockConsole.log).toHaveBeenCalledWith(message, obj);
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      const message = 'Test error message';
      logger.error(message);

      expect(mockConsole.error).toHaveBeenCalledWith(message);
    });

    it('should log error messages with objects', () => {
      const message = 'Test error';
      const obj = { error: 'details' };
      logger.error(message, obj);

      expect(mockConsole.error).toHaveBeenCalledWith(message, obj);
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      const message = 'Test warning message';
      logger.warn(message);

      expect(mockConsole.warn).toHaveBeenCalledWith(message);
    });

    it('should log warning messages with objects', () => {
      const message = 'Test warning';
      const obj = { warning: 'details' };
      logger.warn(message, obj);

      expect(mockConsole.warn).toHaveBeenCalledWith(message, obj);
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      const message = 'Test info message';
      logger.info(message);

      expect(mockConsole.info).toHaveBeenCalledWith(message);
    });

    it('should log info messages with objects', () => {
      const message = 'Test info';
      const obj = { info: 'details' };
      logger.info(message, obj);

      expect(mockConsole.info).toHaveBeenCalledWith(message, obj);
    });
  });

  describe('debug', () => {
    it('should log debug messages', () => {
      const message = 'Test debug message';
      logger.debug(message);

      expect(mockConsole.log).toHaveBeenCalledWith(message);
    });

    it('should log debug messages with objects', () => {
      const message = 'Test debug';
      const obj = { debug: 'details' };
      logger.debug(message, obj);

      expect(mockConsole.log).toHaveBeenCalledWith(message, obj);
    });
  });
});
