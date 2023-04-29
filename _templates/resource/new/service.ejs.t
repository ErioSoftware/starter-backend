---
to: src/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>.service.ts
---
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Create<%= Name %>Dto } from './dto/create-<%= name %>.dto';
import { Update<%= Name %>Dto } from './dto/update-<%= name %>.dto';
import { <%= Name %>Params } from './dto/<%= name %>.params';
import { <%= Name %> } from './entities/<%= name %>.entity';
import { buildQuery } from './<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>.query-builder';

@Injectable()
export class <%= h.inflection.pluralize(Name) %>Service {
  constructor(
    @InjectRepository(<%= Name %>)
    private <%= name %>Repository: Repository<<%= Name %>>,
  ) {}

  findAll(params: <%= Name %>Params): Promise<Pagination<<%= Name %>>> {
    const { paginationOptions, findOptions, orderOptions } = buildQuery(params);
    return paginate<<%= Name %>>(this.<%= name %>Repository, paginationOptions, {
      where: findOptions,
      order: orderOptions,
    });
  }

  async findOne(id: number): Promise<<%= Name %>> {
    const <%= name %> = await this.<%= name %>Repository.findOne({ where: { id } });
    if (!<%= name %> || !id)
      throw new BadRequestException('Not Found');
    return <%= name %>;
  }

  create(create<%= Name %>Dto: Create<%= Name %>Dto): Promise<<%= Name %>> {
    return this.<%= name %>Repository.save(new <%= Name %>(create<%= Name %>Dto));
  }

  async update(
    id: number,
    update<%= Name %>Dto: Update<%= Name %>Dto,
  ): Promise<<%= Name %>> {
    const <%= name %> = await this.findOne(id);
    Object.assign(<%= name %>, update<%= Name %>Dto);
    return await this.<%= name %>Repository.save(<%= name %>);
  }

  async remove(id: number): Promise<<%= Name %>> {
    const <%= name %> = await this.findOne(id);
    await this.<%= name %>Repository.delete(id);
    return <%= name %>;
  }
}
