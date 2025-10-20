const GetRecommendationsQuery = require('../../../src/core/services/features/recommendations/queries/getRecommendations/getRecommendationsQuery');

describe('GetRecommendationsQuery', () => {
  describe('Constructor', () => {
    it('should create query with empty data', () => {
      const queryData = {};

      const query = new GetRecommendationsQuery(queryData);

      expect(query).toBeDefined();
    });

    it('should handle null query data', () => {
      const queryData = null;

      const query = new GetRecommendationsQuery(queryData);

      expect(query).toBeDefined();
    });

    it('should handle undefined query data', () => {
      const queryData = undefined;

      const query = new GetRecommendationsQuery(queryData);

      expect(query).toBeDefined();
    });
  });
});
