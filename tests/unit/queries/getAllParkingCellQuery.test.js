const GetAllParkingCellQuery = require('../../../src/core/services/features/parkingCell/queries/getAllParkingCell/getAllParkingCellQuery');

describe('GetAllParkingCellQuery', () => {
  describe('Constructor', () => {
    it('should create query with empty data', () => {
      const queryData = {};

      const query = new GetAllParkingCellQuery(queryData);

      expect(query).toBeDefined();
    });

    it('should handle null query data', () => {
      const queryData = null;

      const query = new GetAllParkingCellQuery(queryData);

      expect(query).toBeDefined();
    });

    it('should handle undefined query data', () => {
      const queryData = undefined;

      const query = new GetAllParkingCellQuery(queryData);

      expect(query).toBeDefined();
    });
  });
});
