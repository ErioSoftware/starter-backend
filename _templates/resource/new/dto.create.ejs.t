---
to: src/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>/dto/create-<%= name %>.dto.ts
---

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Create<%= Name %>Dto {<% for (const field of fields) { %>
  @ApiProperty({ example:<% if (!["string", "date"].includes(field.type)) { %> <%= field.swagger_example %><% } else { %> '<%= field.swagger_example %>'<% } %> })<% if (field.required) { %>
  @IsNotEmpty()<% } %>
  <%= field.name %><%= field.required ? '' : '?' %>: <%= field.displayType %>;
  <% } %>
}
