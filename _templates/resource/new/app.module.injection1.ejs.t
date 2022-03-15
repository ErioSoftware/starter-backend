---
inject: true
prepend: true
to: src/app.module.ts
---
import { <%= h.inflection.pluralize(Name) %>Module } from './<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>.module';