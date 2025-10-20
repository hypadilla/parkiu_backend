const GetUserByUsernameQuery = require('../../../src/core/services/features/user/queries/getUserByUsernameQuery/getUserByUsernameQuery');

describe('GetUserByUsernameQuery', () => {
  describe('Constructor', () => {
    it('should create query with username', () => {
      const queryData = {
        username: 'testuser'
      };

      const query = new GetUserByUsernameQuery(queryData);

      expect(query.username).toBe('testuser');
    });

    it('should handle empty query data', () => {
      const queryData = {};

      const query = new GetUserByUsernameQuery(queryData);

      expect(query.username).toBeUndefined();
    });
  });
});
