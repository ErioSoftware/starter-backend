---
to: src/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>.module.ts
---
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <%= Name %> } from './entities/<%= name %>.entity';
import { <%= h.inflection.pluralize(Name) %>Controller } from './<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>.controller';
import { <%= h.inflection.pluralize(Name) %>Service } from './<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>.service';

@Module({
  imports: [TypeOrmModule.forFeature([<%= Name %>])],
  providers: [<%= h.inflection.pluralize(Name) %>Service],
  controllers: [<%= h.inflection.pluralize(Name) %>Controller],
  exports: [<%= h.inflection.pluralize(Name) %>Service],
})
export class <%= h.inflection.pluralize(Name) %>Module {}
