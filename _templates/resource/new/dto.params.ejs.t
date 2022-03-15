---
to: src/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>/dto/<%= name %>.params.ts
---

import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from '../../common/pagination/pagination-params';

export class <%= Name %>Params extends PaginationParams {
  @ApiProperty({ required: false })
  name: string;
}
