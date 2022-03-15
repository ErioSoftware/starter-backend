---
to: src/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>/entities/<%= name %>.entity.ts
---
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class <%= Name %> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  constructor(data: Partial<<%= Name %>> = {}) {
    Object.assign(this, data);
  }
}
