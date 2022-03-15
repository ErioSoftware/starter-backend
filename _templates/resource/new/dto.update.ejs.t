---
to: src/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>/dto/update-<%= name %>.dto.ts
---

import { PartialType } from '@nestjs/swagger';
import { Create<%= Name %>Dto } from './create-<%= name %>.dto';

export class Update<%= Name %>Dto extends PartialType(Create<%= Name %>Dto) {}
