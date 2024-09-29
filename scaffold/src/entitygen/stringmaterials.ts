import { Column, Data } from './data.dto';

interface Datatypes {
  [type: string]: (additionalProperties: string) => {
    column: string;
    type: string;
  };
}

export const datatypes: Datatypes = {
  varchar: (additionalProperties) => ({
    column: `{
   type: "varchar",   ${additionalProperties}
  }`,
    type: 'string',
  }),
  text: (additionalProperties) => ({
    column: `{
   type: "text",   ${additionalProperties}
  }`,
    type: 'string',
  }),
  integer: (additionalProperties) => ({
    column: `{
   type: "int",   ${additionalProperties}
  }`,
    type: 'number',
  }),
  blob: (additionalProperties) => ({
    column: `{
   type: "blob",   ${additionalProperties}
  }`,
    type: 'Blob',
  }),
  double: (additionalProperties) => ({
    column: `{
   type: "double",   ${additionalProperties}
  }`,
    type: 'number',
  }),
  boolean: (additionalProperties) => ({
    column: `{
   type: "boolean",   ${additionalProperties}
  }`,
    type: 'boolean',
  }),
  date: (additionalProperties) => ({
    column: `{
   type: "date",   ${additionalProperties}
  }`,
    type: 'string',
  }),
  datetime: (additionalProperties) => ({
    column: `{
   type: "datetime",   ${additionalProperties}
  }`,
    type: 'string',
  }),
};


export const relationshipString = (
  rel: string
): string =>
 `@${rel}

`;

export const columnString = (
  item: Column,
  datatypes: Datatypes,
  additionalProperties: string,
): string =>
  `${item.index ? '\n  @Index()' : ''}
  @Column(${datatypes[item.datatype](additionalProperties).column})
  ${item.nameOfColumn}${!item.notNull ? '!' : ''}: ${
    datatypes[item.datatype](additionalProperties).type
    };
  `;

export function getStringEntity(
  imports: string,
  model: string,
  Model: string,
  columns: string,
  relationships: string,
  entityImports: string
): string {
  const entity = `
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';
${imports}
${entityImports}

@Entity({ name: '${model}' })
export class ${Model} extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  ${columns}
  ${relationships}
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
`;
  return entity;
}

export const getFromBetween = {
  results: [],
  string: "",
  getFromBetween: function (sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
    var SP = this.string.indexOf(sub1) + sub1.length;
    var string1 = this.string.substr(0, SP);
    var string2 = this.string.substr(SP);
    var TP = string1.length + string2.indexOf(sub2);
    return this.string.substring(SP, TP);
  },
  removeFromBetween: function (sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
    var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
    this.string = this.string.replace(removal, "");
  },
  getAllResults: function (sub1, sub2) {
    // first check to see if we do have both substrings
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

    // find one result
    var result = this.getFromBetween(sub1, sub2);
    // push it to the results array
    this.results.push(result);
    // remove the most recently found one from the string
    this.removeFromBetween(sub1, sub2);

    // if there's more substrings
    if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
      this.getAllResults(sub1, sub2);
    }
    else return;
  },
  get: function (string, sub1, sub2) {
    this.results = [];
    this.string = string;
    this.getAllResults(sub1, sub2);
    return this.results;
  }
};


