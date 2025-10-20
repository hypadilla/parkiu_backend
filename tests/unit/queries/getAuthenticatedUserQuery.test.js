const GetAuthenticatedUserQuery = require('../../../src/core/services/features/user/queries/getAuthenticatedUserQuery/getAuthenticatedUserQuery');

describe('GetAuthenticatedUserQuery', () => {
  describe('Constructor', () => {
    it('should create query with id', () => {
      const query = new GetAuthenticatedUserQuery('1');

      expect(query.id).toBe('1');
    });

    it('should handle empty id', () => {
      const query = new GetAuthenticatedUserQuery('');

      expect(query.id).toBe('');
    });

    it('should handle null id', () => {
      const query = new GetAuthenticatedUserQuery(null);

      expect(query.id).toBeNull();
    });

    it('should handle undefined id', () => {
      const query = new GetAuthenticatedUserQuery(undefined);

      expect(query.id).toBeUndefined();
    });
  });
});