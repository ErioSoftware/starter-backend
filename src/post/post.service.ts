import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, SQL } from 'drizzle-orm';
import { DrizzleProvider } from '../common/database/drizzle.module';
import { Post, posts } from '../common/database/schemas/post.schema';
import { DrizzleDatabase } from '../common/database/types/drizzle';
import { PaginatedResponse } from '../common/pagination/pagination.params';
import {
  buildPaginationQuery,
  paginatedResponse,
  PaginationQuery,
  withPagination,
} from '../common/pagination/pagination.utils';
import { CreatePostDto, PostQueryParams, UpdatePostDto } from './post.dto';

@Injectable()
export class PostService {
  constructor(@Inject(DrizzleProvider) private readonly db: DrizzleDatabase) {}

  async findAll(params: PostQueryParams): Promise<PaginatedResponse<Post>> {
    const paginationQuery = buildPaginationQuery(params);
    let itemsQuery = this.db.select().from(posts).$dynamic();
    itemsQuery = this.withFilters(itemsQuery, params);
    itemsQuery = this.withOrder(itemsQuery, paginationQuery);
    itemsQuery = withPagination(itemsQuery, paginationQuery);

    let countQuery = this.db.select({ count: count() }).from(posts);
    countQuery = this.withFilters(countQuery, params);

    const [items, [{ count: totalItems }]] = await Promise.all([
      itemsQuery,
      countQuery,
    ]);
    return paginatedResponse(items, totalItems, paginationQuery);
  }

  async findOne(id: number) {
    const post = await this.db.query.posts.findFirst({
      where: eq(posts.id, id),
    });
    if (!post) throw new NotFoundException('Not found');
    return post;
  }

  async create(createPostDto: CreatePostDto) {
    const [post] = await this.db
      .insert(posts)
      .values(createPostDto)
      .returning();
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const [post] = await this.db
      .update(posts)
      .set(updatePostDto)
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async remove(id: number) {
    const [post] = await this.db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  /**
   * Helper methods for query building
   * These methods handle filtering, ordering, and pagination of post queries
   */
  private withOrder(qb: any, query: PaginationQuery) {
    const orderBy =
      query.order.direction === 'asc'
        ? asc(posts[query.order.key])
        : desc(posts[query.order.key]);
    return qb.orderBy(orderBy);
  }

  private withFilters(qb: any, query: PostQueryParams) {
    const filters: SQL[] = [];
    if (query.title) {
      filters.push(ilike(posts.title, `%${query.title}%`));
    }
    return qb.where(and(...filters));
  }
}
