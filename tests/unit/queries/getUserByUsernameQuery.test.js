const GetUserByUsernameQuery = require('../../../src/core/services/features/user/queries/getUserByUsernameQuery/getUserByUsernameQuery');

describe('GetUserByUsernameQuery', () => {
  describe('Constructor', () => {
    it('should create query with username', () => {
      const query = new GetUserByUsernameQuery('testuser');

      expect(query.username).toBe('testuser');
    });

    it('should handle empty username', () => {
      const query = new GetUserByUsernameQuery('');

      expect(query.username).toBe('');
    });

    it('should handle null username', () => {
      const query = new GetUserByUsernameQuery(null);

      expect(query.username).toBeNull();
    });

    it('should handle undefined username', () => {
      const query = new GetUserByUsernameQuery(undefined);

      expect(query.username).toBeUndefined();
    });

    it('should handle username with special characters', () => {
      const specialUsername = 'user@domain.com';
      const query = new GetUserByUsernameQuery(specialUsername);

      expect(query.username).toBe(specialUsername);
    });

    it('should handle long username', () => {
      const longUsername = 'a'.repeat(100);
      const query = new GetUserByUsernameQuery(longUsername);

      expect(query.username).toBe(longUsername);
    });

    it('should handle username with spaces', () => {
      const usernameWithSpaces = 'user name';
      const query = new GetUserByUsernameQuery(usernameWithSpaces);

      expect(query.username).toBe(usernameWithSpaces);
    });
  });
});