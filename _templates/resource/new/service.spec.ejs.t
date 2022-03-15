---
to: src/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>.service.spec.ts
---
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { <%= Name %> } from './entities/<%= name %>.entity';
import { <%= h.inflection.pluralize(Name) %>Service } from './<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>.service';

describe('<%= h.inflection.pluralize(Name) %>Service', () => {
  let service: <%= h.inflection.pluralize(Name) %>Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        <%= h.inflection.pluralize(Name) %>Service,
        {
          provide: getRepositoryToken(<%= Name %>),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<<%= h.inflection.pluralize(Name) %>Service>(<%= h.inflection.pluralize(Name) %>Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
