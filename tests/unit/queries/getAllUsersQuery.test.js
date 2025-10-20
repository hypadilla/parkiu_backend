const GetAllUsersQuery = require('../../../src/core/services/features/user/queries/getAllUsersQuery/getAllUsersQuery');

describe('GetAllUsersQuery', () => {
  describe('Constructor', () => {
    it('should create query with default parameters', () => {
      const query = new GetAllUsersQuery();

      expect(query.pageSize).toBe(10);
      expect(query.lastVisible).toBeNull();
    });

    it('should create query with custom pageSize', () => {
      const query = new GetAllUsersQuery(20);

      expect(query.pageSize).toBe(20);
      expect(query.lastVisible).toBeNull();
    });

    it('should create query with custom pageSize and lastVisible', () => {
      const query = new GetAllUsersQuery(15, 'lastVisibleToken');

      expect(query.pageSize).toBe(15);
      expect(query.lastVisible).toBe('lastVisibleToken');
    });

    it('should handle zero pageSize', () => {
      const query = new GetAllUsersQuery(0);

      expect(query.pageSize).toBe(0);
      expect(query.lastVisible).toBeNull();
    });

    it('should handle negative pageSize', () => {
      const query = new GetAllUsersQuery(-5);

      expect(query.pageSize).toBe(-5);
      expect(query.lastVisible).toBeNull();
    });

    it('should handle large pageSize', () => {
      const query = new GetAllUsersQuery(1000);

      expect(query.pageSize).toBe(1000);
      expect(query.lastVisible).toBeNull();
    });

    it('should handle empty lastVisible', () => {
      const query = new GetAllUsersQuery(10, '');

      expect(query.pageSize).toBe(10);
      expect(query.lastVisible).toBe('');
    });

    it('should handle undefined lastVisible', () => {
      const query = new GetAllUsersQuery(10, undefined);

      expect(query.pageSize).toBe(10);
      expect(query.lastVisible).toBeNull();
    });

    it('should handle numeric lastVisible', () => {
      const query = new GetAllUsersQuery(10, 123);

      expect(query.pageSize).toBe(10);
      expect(query.lastVisible).toBe(123);
    });

    it('should handle object lastVisible', () => {
      const lastVisibleObj = { id: '123', timestamp: new Date() };
      const query = new GetAllUsersQuery(10, lastVisibleObj);

      expect(query.pageSize).toBe(10);
      expect(query.lastVisible).toBe(lastVisibleObj);
    });

    it('should handle boolean lastVisible', () => {
      const query = new GetAllUsersQuery(10, true);

      expect(query.pageSize).toBe(10);
      expect(query.lastVisible).toBe(true);
    });
  });
});