"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromBetween = exports.getStringEntity = exports.columnString = exports.relationshipString = exports.datatypes = void 0;
exports.datatypes = {
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
const relationshipString = (rel) => `@${rel}

`;
exports.relationshipString = relationshipString;
const columnString = (item, datatypes, additionalProperties) => `${item.index ? '\n  @Index()' : ''}
  @Column(${datatypes[item.datatype](additionalProperties).column})
  ${item.nameOfColumn}${!item.notNull ? '!' : ''}: ${datatypes[item.datatype](additionalProperties).type};
  `;
exports.columnString = columnString;
function getStringEntity(imports, model, Model, columns, relationships, entityImports) {
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
exports.getStringEntity = getStringEntity;
exports.getFromBetween = {
    results: [],
    string: "",
    getFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
            return false;
        var SP = this.string.indexOf(sub1) + sub1.length;
        var string1 = this.string.substr(0, SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP, TP);
    },
    removeFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
            return false;
        var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
        this.string = this.string.replace(removal, "");
    },
    getAllResults: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
            return;
        var result = this.getFromBetween(sub1, sub2);
        this.results.push(result);
        this.removeFromBetween(sub1, sub2);
        if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1, sub2);
        }
        else
            return;
    },
    get: function (string, sub1, sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1, sub2);
        return this.results;
    }
};
//# sourceMappingURL=stringmaterials.js.map