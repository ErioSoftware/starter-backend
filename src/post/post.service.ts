import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, SQL } from 'drizzle-orm';
import { DrizzleProvider } from '../common/database/drizzle.module';
import { Post, posts } from '../common/database/schemas/post.schema';
import { DrizzleDatabase } from '../common/database/types/drizzle';
import { PaginatedResponse } from '../common/pagination/pagination.params';
import {
  buildPaginationQuery,
  paginatedResponse,
} from '../common/pagination/pagination.utils';
import { CreatePostDto, PostQueryParams, UpdatePostDto } from './post.dto';

@Injectable()
export class PostService {
  constructor(@Inject(DrizzleProvider) private readonly db: DrizzleDatabase) {}

  async findAll(params: PostQueryParams): Promise<PaginatedResponse<Post>> {
    const paginationQuery = buildPaginationQuery(params);
    const whereClause = this.buildWhereClause(params);
    const orderClause = this.buildOrderBy(params);

    const itemsQuery = this.db.query.posts.findMany({
      where: whereClause,
      orderBy: orderClause,
      limit: paginationQuery.limit,
      offset: paginationQuery.offset,
    });

    const countQuery = this.db
      .select({ count: count(posts.id) })
      .from(posts)
      .where(whereClause);

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
  private buildOrderBy(params: PostQueryParams): SQL[] {
    const [sortBy, sortOrderString] = params.order?.split(':') || ['id', 'asc'];
    const sortOrder = sortOrderString?.toLowerCase() === 'desc' ? desc : asc;
    // Basic safety check: ensure sortBy is a valid column key
    const column = posts[sortBy];
    if (column) {
      return [sortOrder(column)];
    }
    throw new BadRequestException('Invalid sortBy parameter');
  }

  private buildWhereClause(params: PostQueryParams) {
    const filters: SQL[] = [];
    if (params.title) {
      filters.push(ilike(posts.title, `%${params.title}%`));
    }
    return filters.length > 0 ? and(...filters) : undefined;
  }
}
