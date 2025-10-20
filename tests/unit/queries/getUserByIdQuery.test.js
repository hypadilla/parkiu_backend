const GetUserByIdQuery = require('../../../src/core/services/features/user/queries/getUserByIdQuery/getUserByIdQuery');

describe('GetUserByIdQuery', () => {
  describe('Constructor', () => {
    it('should create query with id', () => {
      const queryData = {
        id: '1'
      };

      const query = new GetUserByIdQuery(queryData);

      expect(query.id).toBe('1');
    });

    it('should handle empty query data', () => {
      const queryData = {};

      const query = new GetUserByIdQuery(queryData);

      expect(query.id).toBeUndefined();
    });
  });
});
