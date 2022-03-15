---
to: src/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>/dto/create-<%= name %>.dto.ts
---

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Create<%= Name %>Dto {
  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  name: string;
}
