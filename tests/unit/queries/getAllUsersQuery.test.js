const GetAllUsersQuery = require('../../../src/core/services/features/user/queries/getAllUsersQuery/getAllUsersQuery');

describe('GetAllUsersQuery', () => {
  describe('Constructor', () => {
    it('should create query with limit and startAfter', () => {
      const queryData = {
        limit: 10,
        startAfter: 'someToken'
      };

      const query = new GetAllUsersQuery(queryData);

      expect(query.limit).toBe(10);
      expect(query.startAfter).toBe('someToken');
    });

    it('should create query with default limit', () => {
      const queryData = {
        startAfter: 'someToken'
      };

      const query = new GetAllUsersQuery(queryData);

      expect(query.limit).toBe(10);
      expect(query.startAfter).toBe('someToken');
    });

    it('should handle empty query data', () => {
      const queryData = {};

      const query = new GetAllUsersQuery(queryData);

      expect(query.limit).toBe(10);
      expect(query.startAfter).toBeUndefined();
    });
  });
});
