import { FindOptionsWhere, ILike } from 'typeorm';
import { buildPaginationQuery } from '../common/pagination/pagination-query-builder';
import { UserParams } from './dto/user.params';
import { User } from './entities/user.entity';

export const buildQuery = (params: UserParams) => {
  const { paginationOptions, orderOptions } = buildPaginationQuery(params);
  const findOptions: FindOptionsWhere<User> = {};
  if (params.name) {
    findOptions.name = ILike(`%${params.name}%`);
  }
  return {
    paginationOptions,
    findOptions,
    orderOptions,
  };
};
