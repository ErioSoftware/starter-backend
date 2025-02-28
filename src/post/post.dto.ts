import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationParams } from '../common/pagination/pagination.params';

export class CreatePostDto {
  @ApiProperty({ example: 'My first post' })
  title: string;

  @ApiProperty({ example: 'This is my first post' })
  description: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class PostQueryParams extends PaginationParams {
  @ApiProperty({ example: 'title', required: false })
  title?: string;
}
