---
to: src/<%= h.changeCase.paramCase(h.inflection.pluralize(name)) %>/entities/<%= name %>.entity.ts
---
import { 
  Column,
  Entity,
  PrimaryGeneratedColumn,
  <% for (const imp of imports.typeOrmImports) { %><%= imp %>,
  <% } %>
} from 'typeorm';
<% for (const ent of imports.importEntities) { %>
import { <%= ent %> } from '../../<%= h.changeCase.paramCase(h.inflection.pluralize(ent)) %>/entities/<%= h.inflection.camelize(ent, true) %>.entity';<% } %>
<% if (imports.importDecimal) { %>import { Decimal } from '../../common/decorators/decimal.decorator';<% } %>

@Entity()
export class <%= Name %> {
  @PrimaryGeneratedColumn()
  id: number;
  <% for (const field of fields) { %><% if (["string", "boolean", "number"].includes(field.type)) { %>
  @Column(<% if (!field.required) { %>{ nullable: true }<% } %>)
  <%= field.name %>: <%= field.type %>;
  <% } %><% if (field.type === "date") { %>
  @Column({ type: 'timestamptz'<% if (!field.required) { %>, nullable: true<% } %> })
  <%= field.name %>: Date;
  <% } %><% if (field.type === "decimal") { %>
  @Decimal()
  <%= field.name %>: number;
  <% } %><% } %><% for (const rel of relations) { %>
  @<%= rel.type %>(() => <%= rel.target %><% if (rel.addReverse) { %>, (<%= h.inflection.camelize(rel.target, true) %>) => <%= h.inflection.camelize(rel.target, true) %>.<%= rel.reverseRelationName %><% } %>)
  <% if (rel.joinColumn) { %>@JoinColumn()<% } %><% if (rel.joinTable) { %>@JoinTable()<% } %><% if (["OneToMany", "ManyToMany"].includes(rel.type)) { %><%= rel.fieldName %>: <%= rel.target %>[];
  <% } %><% if (["OneToOne", "ManyToOne"].includes(rel.type)) { %>
  <%= rel.fieldName %>: <%= rel.target %>;
  <% } %><% } %><% if (addDates) { %>
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
  <% } %>
  constructor(data: Partial<<%= Name %>> = {}) {
    Object.assign(this, data);
  }
}
