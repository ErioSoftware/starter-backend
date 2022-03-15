---
to: src/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>.query-builder.ts
---
import { FindConditions } from 'typeorm';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { <%= Name %>Params } from './dto/<%= name %>.params';
import { <%= Name %> } from './entities/<%= name %>.entity';

export const buildQuery = (params: <%= Name %>Params) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindConditions<<%= Name %>> = {};
  return {
    paginationOptions,
    findOptions,
    orderOptions,
  };
};
