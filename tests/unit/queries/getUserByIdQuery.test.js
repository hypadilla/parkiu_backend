const GetUserByIdQuery = require('../../../src/core/services/features/user/queries/getUserByIdQuery/getUserByIdQuery');

describe('GetUserByIdQuery', () => {
  describe('Constructor', () => {
    it('should create query with id', () => {
      const query = new GetUserByIdQuery('507f1f77bcf86cd799439011');

      expect(query.id).toBe('507f1f77bcf86cd799439011');
    });

    it('should handle empty id', () => {
      const query = new GetUserByIdQuery('');

      expect(query.id).toBe('');
    });

    it('should handle null id', () => {
      const query = new GetUserByIdQuery(null);

      expect(query.id).toBeNull();
    });

    it('should handle undefined id', () => {
      const query = new GetUserByIdQuery(undefined);

      expect(query.id).toBeUndefined();
    });

    it('should handle numeric id', () => {
      const query = new GetUserByIdQuery(123);

      expect(query.id).toBe(123);
    });

    it('should handle UUID format id', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const query = new GetUserByIdQuery(uuid);

      expect(query.id).toBe(uuid);
    });

    it('should handle short id', () => {
      const shortId = '1';
      const query = new GetUserByIdQuery(shortId);

      expect(query.id).toBe(shortId);
    });
  });
});