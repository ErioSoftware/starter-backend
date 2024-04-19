const getEntityInfo = async (prompter) => {
  return prompter.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the resource?',
    },
    {
      type: 'select',
      name: 'addDates',
      message: 'Add date fields? (created_at, updated_at, deleted_at)',
      choices: ['Yes', 'No'],
    },
  ]);
};

const validFieldTypes = ['string', 'number', 'boolean', 'decimal', 'date'];

const getField = async (prompter) => {
  const { field } = await prompter.prompt([
    {
      type: 'form',
      name: 'field',
      message: 'Add a field',
      choices: [
        {
          name: 'name',
          message: 'Field name',
          initial: 'name',
        },
        {
          name: 'type',
          message: 'Field type',
          initial: 'string',
        },
        {
          name: 'swagger_example',
          message: 'Swagger example',
          initial: 'Joe Doe',
        },
        {
          name: 'required',
          message: 'Required? (true/false)',
          initial: 'true',
        },
      ],
    },
  ]);
  return sanitizeField(field);
};

const sanitizeField = (field) => {
  if (field.required === 'true') {
    field.required = true;
  } else if (field.required === 'false') {
    field.required = false;
  } else if (!['true', 'false'].includes(field.required)) {
    throw new Error('Required must be true or false');
  }
  if (field.name === 'id') {
    throw new Error('id is a reserved field name');
  }
  if (!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(field.name)) {
    throw new Error('Invalid field name');
  }
  if (!validFieldTypes.includes(field.type)) {
    throw new Error('Invalid field type');
  }
  if (field.type === 'decimal') {
    field.displayType = 'number';
  } else if (field.type === 'date') {
    field.displayType = 'Date';
  } else {
    field.displayType = field.type;
  }
  return field;
};

const getRelation = async (prompter) => {
  const relation = {};
  const { type } = await prompter.prompt([
    {
      type: 'select',
      name: 'type',
      message: 'Relation type',
      choices: ['One to one', 'One to many', 'Many to one', 'Many to many'],
    },
  ]);
  relation.type = type;
  const { target } = await prompter.prompt([
    {
      type: 'input',
      name: 'target',
      message: 'Target entity',
      validate: (value) => {
        if (!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(value)) {
          return 'Invalid entity name';
        }
        return true;
      },
    },
  ]);
  relation.target = target;
  const { fieldName } = await prompter.prompt([
    {
      type: 'input',
      name: 'fieldName',
      message: 'Field name',
      validate: (value) => {
        if (!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(value)) {
          return 'Invalid field name';
        }
        return true;
      },
    },
  ]);
  relation.fieldName = fieldName;
  if (relation.type === 'One to one') {
    const { joinColumn } = await prompter.prompt([
      {
        type: 'select',
        message: 'Join column?',
        name: 'joinColumn',
        choices: ['Yes', 'No'],
      },
    ]);
    relation.joinColumn = joinColumn;
  }
  if (relation.type === 'Many to many') {
    const { joinTable } = await prompter.prompt([
      {
        type: 'select',
        message: 'Join table?',
        name: 'joinTable',
        choices: ['Yes', 'No'],
      },
    ]);
    relation.joinTable = joinTable;
  }
  const { addReverse } = await prompter.prompt([
    {
      type: 'select',
      message: 'Add reverse relation?',
      name: 'addReverse',
      choices: ['Yes', 'No'],
    },
  ]);
  relation.addReverse = addReverse;
  if (relation.addReverse === 'Yes') {
    const { reverseRelationName } = await prompter.prompt([
      {
        type: 'input',
        name: 'reverseRelationName',
        message: 'Name of this field in reverse relation',
        validate: (value) => {
          if (!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(value)) {
            return 'Invalid field name';
          }
          return true;
        },
      },
    ]);
    relation.reverseRelationName = reverseRelationName;
  }
  return sanitizeRelation(relation);
};

const sanitizeRelation = (relation) => {
  relation.addReverse = relation.addReverse === 'Yes';
  if (relation.type === 'One to one') {
    relation.joinColumn = relation.joinColumn === 'Yes';
  }
  if (relation.type === 'Many to many') {
    relation.joinTable = relation.joinTable === 'Yes';
  }
  const translations = {
    'One to one': 'OneToOne',
    'One to many': 'OneToMany',
    'Many to one': 'ManyToOne',
    'Many to many': 'ManyToMany',
  };
  relation.type = translations[relation.type];
  return relation;
};

const getImports = (fields, relations, addDates) => {
  const typeOrmImports = [];
  // import the correct type for each relation
  relations.forEach((relation) => {
    if (!typeOrmImports.includes(relation.type)) {
      typeOrmImports.push(relation.type);
    }
  });
  // import JoinTable if any relation has joinTable
  if (relations.some((relation) => relation.joinTable)) {
    typeOrmImports.push('JoinTable');
  }
  // import JoinColumn if any relation has joinColumn
  if (relations.some((relation) => relation.joinColumn)) {
    typeOrmImports.push('JoinColumn');
  }
  if (addDates === 'Yes') {
    typeOrmImports.push(
      'CreateDateColumn',
      'UpdateDateColumn',
      'DeleteDateColumn',
    );
  }
  // import the relation target entities
  const importEntities = relations.map((relation) => relation.target);

  return {
    imports: {
      importDecimal: fields.some((field) => field.type === 'decimal'),
      typeOrmImports,
      importEntities,
    },
  };
};

module.exports = {
  prompt: async ({ prompter }) => {
    const { name, addDates } = await getEntityInfo(prompter);
    const fields = [];
    const relations = [];
    while (true) {
      const { selection } = await prompter.prompt([
        {
          type: 'select',
          name: 'selection',
          message: 'Add a field or finish?',
          choices: ['Add a regular field', 'Add a relation', 'Finish'],
        },
      ]);
      if (selection === 'Finish') break;
      if (selection === 'Add a regular field') {
        fields.push(await getField(prompter));
      }
      if (selection === 'Add a relation') {
        relations.push(await getRelation(prompter));
      }
    }

    const { imports } = getImports(fields, relations, addDates);
    console.info('\nAdding entity with the following data:', {
      imports,
      name,
      fields,
      relations,
    });
    return {
      name,
      fields,
      imports,
      relations,
      addDates: addDates === 'Yes',
    };
  },
};
