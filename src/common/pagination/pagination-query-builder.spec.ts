import { getOrder } from './order-options-builder';
import { buildPaginationQuery } from './pagination-query-builder';

describe('PaginationQueryBuilder', () => {
  describe('buildPaginationQuery', () => {
    it('should return correct object', () => {
      expect(
        buildPaginationQuery({ limit: 10, page: 2, order: 'id:desc' }),
      ).toEqual({
        paginationOptions: {
          limit: 10,
          page: 2,
        },
        orderOptions: {
          id: 'DESC',
        },
      });
    });

    it('should have default values for every param', () => {
      expect(buildPaginationQuery({})).toEqual({
        paginationOptions: {
          limit: 100,
          page: 1,
        },
        orderOptions: {
          id: 'ASC',
        },
      });
    });
  });

  describe('getOrder', () => {
    it('should return correct object', () => {
      expect(getOrder('id:asc')).toEqual({
        id: 'ASC',
      });
    });

    it('should throw if malformed string', () => {
      expect(() => getOrder('idasc')).toThrow('Bad order string');
    });
  });
});
