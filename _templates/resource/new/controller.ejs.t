---
to: src/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>.controller.ts
---
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from '../common/filters/queryFailedExceptionFilter';
import { Update<%= Name %>Dto } from './dto/update-<%= name %>.dto';
import { <%= Name %>Params } from './dto/<%= name %>.params';
import { <%= h.inflection.pluralize(Name) %>Service } from './<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>.service';
import { Create<%= Name %>Dto } from './dto/create-<%= name %>.dto';

@ApiBearerAuth()
@ApiTags('<%= h.inflection.pluralize(Name) %>')
@Controller('<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>')
export class <%= h.inflection.pluralize(Name) %>Controller {
  constructor(private readonly <%= name %>Service: <%= h.inflection.pluralize(Name) %>Service) {}

  @ApiOkResponse()
  @Get()
  findAll(@Query() query: <%= Name %>Params) {
    return this.<%= name %>Service.findAll(query);
  }

  @ApiOkResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.<%= name %>Service.findOne(+id);
  }

  @ApiCreatedResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Post()
  create(@Body() create<%= Name %>Dto: Create<%= Name %>Dto) {
    return this.<%= name %>Service.create(create<%= Name %>Dto);
  }

  @ApiOkResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Patch(':id')
  update(@Param('id') id: string, @Body() update<%= Name %>Dto: Update<%= Name %>Dto) {
    return this.<%= name %>Service.update(+id, update<%= Name %>Dto);
  }

  @ApiOkResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.<%= name %>Service.remove(+id);
  }
}
