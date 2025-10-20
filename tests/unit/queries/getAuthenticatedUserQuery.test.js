const GetAuthenticatedUserQuery = require('../../../src/core/services/features/user/queries/getAuthenticatedUserQuery/getAuthenticatedUserQuery');

describe('GetAuthenticatedUserQuery', () => {
  describe('Constructor', () => {
    it('should create query with userId', () => {
      const queryData = {
        userId: '1'
      };

      const query = new GetAuthenticatedUserQuery(queryData);

      expect(query.userId).toBe('1');
    });

    it('should handle empty query data', () => {
      const queryData = {};

      const query = new GetAuthenticatedUserQuery(queryData);

      expect(query.userId).toBeUndefined();
    });

    it('should handle null query data', () => {
      const queryData = null;

      const query = new GetAuthenticatedUserQuery(queryData);

      expect(query.userId).toBeUndefined();
    });
  });
});
