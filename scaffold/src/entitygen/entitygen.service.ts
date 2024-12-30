import fs from "fs";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { promises as fsPromises } from "fs";
import { DataSource } from "typeorm";
import { Column, Data, Relationship } from "./data.dto";
import { PathsService } from "./paths/paths.service";

import {
  capitalizeFirstLetter,
  getObjectBetweenParentheses,
} from 'src/utils/string.functions';
import {
  columnString,
  datatypes,
  getFromBetween,
  getStringEntity,
} from './stringmaterials';


type FormColumn = {
  nameOfColumn: string;
  datatype: string;
  notNull: boolean;
  unique: boolean;
  index: boolean;
};

type FormRelationship = {
  type: string;
  table: string;
};

type FormState = {
  name?: string;
  columns?: FormColumn[];
  relationships?: FormRelationship[];
};

@Injectable()
export class EntitygenService implements OnModuleInit {
  private logger = new Logger(EntitygenService.name);

  private content: string;

  private firstTableName = '';

  private data: Data | null = null;
  //private model: string;

  //private secondContent: string = '';
  //private secondModel: string = '';

  private entityArr: { content: string; model: string }[] = [];

  //private projectUrl = this.envService.getProcessProjectUrl();
  //private rootUrl = this.envService.getRootUrl();

  constructor(
    private pathsService: PathsService,
    private dataSource: DataSource,
  ) {}

  onModuleInit() {
    ////this.logger.log(this.envService.getProcessProjectUrl(), 'log')
  }

  private isAllowedRelationshipCreating = true;

  setChangedDataToNull(): void {
    this.data = null;
  }

  async getEntityDataForView(entityName: string): Promise<{ data: Data }> {
    const projectUrl = this.pathsService.getProcessProjectUrl();
    //const rootUrl = this.envService.getRootUrl();
	this.logger.log('check project dir', projectUrl);

    enum RelationshipType {
      'ONE_TO_ONE' = 'OneToOne',
      'ONE_TO_MANY' = 'OneToMany',
      'MANY_TO_ONE' = 'ManyToOne',
      'MANY_TO_MANY' = 'ManyToMany',
    }

    const data: Data = {
      name: '',
      columns: [],
      relationships: [],
    };
    /*
		let txt = '';
		try {
			txt = await fsPromises.readFile(`${projectUrl}/src/server/entity/${entityName}.entity.ts`, 'utf8');

		}
		catch (err) {
			//this.logger.error(`Error: ${err}`);
		}

		if (!(!!txt)) {
			//this.logger.log(`txt ${typeof txt}`)
			return { data: data };
		}*/
    if (
      fs.existsSync(`${projectUrl}/src/server/entity/${entityName}.entity.ts`)
    ) {
      const txt = await fsPromises.readFile(
        `${projectUrl}/src/server/entity/${entityName}.entity.ts`,
        'utf8',
      );
      const txtWithoutWhiteSpace = txt.replace(/ /g, '').replace(/\n/g, '');
      //this.logger.log(txtWithoutWhiteSpace, 'txt');
      const txtArray = txtWithoutWhiteSpace
        .split(';')
        .map((item) => item + ';');
      const columnTxtArray = txtArray.filter(
        (item) => item.startsWith('@Index') || item.startsWith('@Column'),
      );
      //this.logger.log(JSON.stringify(columnTxtArray, null, 4), 'txtArray');
      const relTxtArray = txtArray.filter(
        (item) =>
          item.startsWith(`@${RelationshipType.ONE_TO_ONE}`) ||
          item.startsWith(`@${RelationshipType.ONE_TO_MANY}`) ||
          item.startsWith(`@${RelationshipType.MANY_TO_ONE}`) ||
          item.startsWith(`@${RelationshipType.MANY_TO_MANY}`) ||
          item.startsWith(`@JoinColumn`) ||
          item.startsWith(`@JoinTable`),
      );
      const tableName: string = getFromBetween.get(
        txtWithoutWhiteSpace,
        '@Entity({name:',
        '})',
      );

      data.name = tableName[0].replace(/'/g, '');
      data.name = capitalizeFirstLetter(
        data.name
          .split('_')
          .map((item) => capitalizeFirstLetter(item))
          .join(''),
      );

      const columnData = getFromBetween.get(
        txtWithoutWhiteSpace,
        '@Column({',
        '})',
      );
      //const parsedColumnData = JSON.parse(JSON.stringify(columnData));

      const columns: FormColumn[] = [];
      const relationships: FormRelationship[] = [];

      //let entireColumnData = getFromBetween.get(txtWithoutWhiteSpace, "@Column({", "@");
      const entireColumnData = getFromBetween.get(
        txtWithoutWhiteSpace,
        '@Column({',
        ';@',
      );
      ////this.logger.log(txtWithoutWhiteSpace, 'txt')

      //this.logger.log(JSON.stringify(columnTxtArray, null, 4));
      columnTxtArray.forEach((element) => {
        let isUnique = getFromBetween.get(element + ':', 'unique:', ':');
        ////this.logger.log(element, 'element')
        isUnique = isUnique.length < 1 ? false : Boolean(isUnique);
        const datatype =
          getFromBetween.get(element, 'type:"', '"')[0] === 'int'
            ? 'integer'
            : getFromBetween.get(element, 'type:"', '"')[0];
        ////this.logger.warn(getFromBetween.get(element, 'type:"', '"'), 'datatype');
        let notNull = getFromBetween.get(element + ':', 'nullable:', ':');
        notNull = !(notNull.length < 1) ? false : Boolean(notNull);

        let columnName = getFromBetween
          .get(element, '})', ';')[0]
          .split(':')[0];

        if (columnName.charAt(columnName.length - 1) === '!') {
          columnName = columnName.substring(0, columnName.length - 1);
        }

        const isIndex = element.startsWith('@Index()');
        ////this.logger.debug(columnName, 'columnName')
        /*
         */

        columns.push({
          nameOfColumn: columnName,
          notNull: notNull,
          unique: isUnique,
          index: isIndex,
          datatype: datatype,
        });
        //this.logger.log('##################');
      });

      //this.logger.warn(relTxtArray, 'relTxtArray');
      relTxtArray.forEach((element) => {
        const [relType] = getFromBetween
          .get(element, '@', '(()=>')[0]
          .startsWith('JoinTable()@')
          ? getFromBetween.get(element, '@JoinTable()@', '(()=>')
          : getFromBetween.get(element, '@', '(()=>');
        //const entity = (getFromBetween.get(element, '(()=>', ',') + '').toLowerCase();
        const entity = (getFromBetween.get(element, '(()=>', ',') + '')
          .split(/(?=[A-Z])/)
          .map((item: string) => item.toLocaleLowerCase())
          .join('_');

        relationships.push({
          type: relType,
          table: entity + '',
        });
        //this.logger.error(relType, 'relType');
        //this.logger.error(entity, 'entity');
      });

      //entireColumnData = getFromBetween.get(entireColumnData, ')', ';')
      ////this.logger.warn(getFromBetween.get(entireColumnData[0], "})", ";")[0].split(':'));
      //this.logger.debug(JSON.parse(JSON.stringify(entireColumnData))[0]);
      //this.logger.log(JSON.stringify(columns));
      data.columns = [...columns];

      if (relationships.length === 0) {
        data.relationships = [
          {
            type: 'OneToOne',
            table: '',
          },
        ];
      } else {
        data.relationships = [...relationships];
      }
    }

    return { data: data };
  }

  async createEntityFile(data: Data): Promise<{ data: string }> {
    const projectUrl = this.pathsService.getProcessProjectUrl();
    const conn = this.dataSource.createQueryRunner();

    if (!this.data) {
      this.data = data;
      this.logger.debug('set default data', this.data);
    }

    if (this.firstTableName === '') {
      this.firstTableName = data.name;
    }

    const getModel: (entityName: string) => string = (entityName: string) =>
      entityName
        .split(/(?=[A-Z])/)
        .map((item) => item.toLowerCase())
        .join('_');

    const unchangedData: Data = (
      await this.getEntityDataForView(getModel(this.data.name))
    ).data;

    const isAllowedFileWriting = async (tableName: string, entity: string) => {
      const oppositeData: Data = (await this.getEntityDataForView(tableName))
        .data;

      return oppositeData.relationships.every(
        (item: Relationship) => item.table !== entity,
      );
    };

    //this.logger.log('data with change', JSON.stringify(data, null, 4));

    const getDataWithDeletingPreviousConnectedRelationships = async (
      tableName: string,
      changedData: Data,
    ) => {
      const oppositeData: Data = (await this.getEntityDataForView(tableName))
        .data;

      const unchangedEntityData: Data = (
        await this.getEntityDataForView(getModel(this.data.name))
      ).data;
      /*this.logger.debug(
        '[getDataWithDeletingPreviousConnectedRelationships] data.name',
        changedData.name,
      );*/
      this.logger.debug(
        '[getDataWithDeletingPreviousConnectedRelationships] changedData',
        changedData,
      );
      /*this.logger.debug(
        '[getDataWithDeletingPreviousConnectedRelationships] tableName',
        tableName,
      );*/
      /*
      //this.logger.debug(
        '[getDataWithDeletingPreviousConnectedRelationships] changedData with no data property',
        (await this.getEntityDataForView(getModel(changedData.name))).data,
      );
     */
      /*this.logger.debug(
        `[getDataWithDeletingPreviousConnectedRelationship] unchangedData}`,
        unchangedData,
      );*/

      /*this.logger.debug(
        `[getDataWithDeletingPreviousConnectedRelationship] data ${unchangedData.name}`,
        data,
      );*/

      let missingItems: Relationship[] = [];
      missingItems = unchangedData.relationships.filter(
        (unchangedItem: Relationship) =>
          changedData.relationships.every(
            (item: Relationship) =>
              item.table !== unchangedItem.table &&
              item.type !== unchangedItem.type,
          ),
      );

      this.logger.debug(
        `missingItems ${data.name}`,
        missingItems,
      );

      if (missingItems.length > 0) {
        oppositeData.relationships = [
          ...oppositeData.relationships.filter((item) => {
            return missingItems.every(
              (missingItem: Relationship) => missingItem.table !== item.table,
            );
          }),
        ];
      }

      return oppositeData;
    };

    try {
      /*
      const areTwoOrMoreDuplicate = (table) => {
        let isDuplicate = false;
        if (this.entityArr.length > 0) {
          const valueArr = this.entityArr.map((item) => {
            return item.model;
          });
          //this.logger.log(JSON.stringify(valueArr, null, 4));

          //isDuplicate = valueArr.includes(table);
          isDuplicate = valueArr.some((item, idx) => {
            this.logger.log(
              `valueArr.indexOf(item): ${valueArr.indexOf(
                item,
              )} item: ${item} idx: ${idx} valueArr.indexOf(item) != idx: ${
                valueArr.indexOf(item) != idx
              }`,
            );
            return valueArr.indexOf(item) != idx;
          });
        }

        return isDuplicate;
      };
      */

      const model: string = data.name
        .split(/(?=[A-Z])/)
        .map((item) => item.toLowerCase())
        .join('_');

      const Model: string = capitalizeFirstLetter(data.name);

      let importsArray: string[] = [];

      const cols: string[] = data.columns.map((item: Column) => {
        const additionalProperties =
          (!item.notNull ? '\n   nullable: true,' : '') +
          (item.unique ? '\n   unique: true' : '');

        const column = columnString(item, datatypes, additionalProperties);

        if (!importsArray.includes('Index')) importsArray.push('Index');

        return column;
      });

      enum RelationshipType {
        'ONE_TO_ONE' = 'OneToOne',
        'ONE_TO_MANY' = 'OneToMany',
        'MANY_TO_ONE' = 'ManyToOne',
        'MANY_TO_MANY' = 'ManyToMany',
      }
      const relArray = [];

      const entityImportsArray = [];

      const dataRelArray: Relationship[] =
        unchangedData.name === data.name &&
        unchangedData.relationships.length > data.relationships.length &&
        fs.existsSync(
          `${projectUrl}/src/server/entity/${getModel(data.name)}.entity.ts`,
        )
          ? unchangedData.relationships ?? []
          : data.relationships;

      for (const item of dataRelArray) {
        const index: number = data.relationships.indexOf(item);
		this.logger.debug('check item [data.relationships]', data.relationships);
		this.logger.debug('check item [data.relationships.indexOf(item)]', data.relationships.indexOf(item));
		this.logger.debug('check item [data.relationships[index]]', data.relationships[index]);
        //const tableName = data.relationships[index].table;
		const tableName = item.table;
        //this.logger.log({ tableName });
        if (tableName !== '') {
          let rel = '';
          const entity = capitalizeFirstLetter(item.table);
          const _entity = capitalizeFirstLetter(
            entity
              .split('_')
              .map((item) => capitalizeFirstLetter(item))
              .join(''),
          );
          if (item.type === RelationshipType.ONE_TO_ONE) {
            rel = `
  @JoinColumn()
  @${item.type}(() => ${_entity})
  ${item.table}: ${_entity};
`;
            importsArray = [...importsArray, item.type, 'JoinColumn'];

            !relArray.includes(rel) && relArray.push(rel);

            !entityImportsArray.includes(entity) &&
              entityImportsArray.push(_entity);

            //  add to imports OneToOne, JoinColumn
          }

          if (item.type === RelationshipType.ONE_TO_MANY) {
            const _entity = capitalizeFirstLetter(
              entity
                .split('_')
                .map((item) => capitalizeFirstLetter(item))
                .join(''),
            );
            rel = `
  @${item.type}(() => ${_entity}, (${item.table}) => ${item.table}.${model})
  ${item.table}s: ${_entity}[];
`;
            !importsArray.includes(item.type) && importsArray.push(item.type);
            !relArray.includes(rel) && relArray.push(rel);

            !entityImportsArray.includes(entity) &&
              entityImportsArray.push(_entity);

            if (
              this.isAllowedRelationshipCreating &&
              (this.data.name === data.name ||
                (await isAllowedFileWriting(tableName, this.data.name)))
            ) {
              const data: Data =
                await getDataWithDeletingPreviousConnectedRelationships(
                  tableName,
                  this.data,
                );

              if (
                !!data.name &&
                data.columns.length > 0 &&
                data.relationships.length > 0
              ) {
                data.relationships = [
                  ...data.relationships,
                  { table: model, type: RelationshipType.MANY_TO_ONE },
                ];
                /*this.logger.log(
                  'isAllowedRelationshipCreating data',
                  JSON.stringify(data, null, 4),
                );*/
                this.createEntityFile(data).then(
                  () => (this.isAllowedRelationshipCreating = false),
                );
              } else {
                this.isAllowedRelationshipCreating = false;
              }
            }

            //  add to imports OneToMany
            //  change relationship at second entity
          }

          if (item.type === RelationshipType.MANY_TO_ONE) {
            const _entity = capitalizeFirstLetter(
              entity
                .split('_')
                .map((item) => capitalizeFirstLetter(item))
                .join(''),
            );
            rel = `
  @${item.type}(() => ${_entity}, (${item.table}) => ${item.table}.${model}s)
  ${item.table}: ${_entity};
`;
            !importsArray.includes(item.type) && importsArray.push(item.type);
            !relArray.includes(rel) && relArray.push(rel);

            !entityImportsArray.includes(entity) &&
              entityImportsArray.push(_entity);
            if (
              this.isAllowedRelationshipCreating &&
              (this.data.name === data.name ||
                (await isAllowedFileWriting(tableName, this.data.name)))
            ) {
              const data: Data =
                await getDataWithDeletingPreviousConnectedRelationships(
                  tableName,
                  this.data,
                );
              if (
                !!data.name &&
                data.columns.length > 0 &&
                data.relationships.length > 0
              ) {
                data.relationships = [
                  ...data.relationships,
                  { table: model, type: RelationshipType.ONE_TO_MANY },
                ];
                /*this.logger.log(
                  'isAllowedRelationshipCreating data',
                  JSON.stringify(data, null, 4),
                );*/
                this.createEntityFile(data).then(
                  () => (this.isAllowedRelationshipCreating = false),
                );
              } else {
                this.isAllowedRelationshipCreating = false;
              }
            }
          }
          //  add to imports ManyToOne
          //  change relationship at second entity

          if (item.type === RelationshipType.MANY_TO_MANY) {
            const _entity = capitalizeFirstLetter(
              entity
                .split('_')
                .map((item) => capitalizeFirstLetter(item))
                .join(''),
            );
            rel = `
  @JoinTable()                        
  @${item.type}(() => ${_entity}, (${item.table}) => ${item.table}.${model}s)
  ${item.table}s: ${_entity}[];
`;
            if (!importsArray.includes(item.type)) {
              importsArray = [...importsArray, item.type, 'JoinTable'];
            }
            !relArray.includes(rel) && relArray.push(rel);

            !entityImportsArray.includes(entity) &&
              entityImportsArray.push(_entity);
            if (
              this.isAllowedRelationshipCreating &&
              (this.data.name === data.name ||
                (await isAllowedFileWriting(tableName, this.data.name)))
            ) {
              const data: Data =
                await getDataWithDeletingPreviousConnectedRelationships(
                  tableName,
                  this.data,
                );
              if (
                !!data.name &&
                data.columns.length > 0 &&
                data.relationships.length > 0
              ) {
                data.relationships = [
                  ...data.relationships,
                  { table: model, type: RelationshipType.MANY_TO_MANY },
                ];
                //this.logger.warn(this.isAllowedRelationshipCreating);
                /*this.logger.log(
                  'isAllowedRelationshipCreating data',
                  JSON.stringify(data, null, 4),
                );*/
                this.createEntityFile(data).then(() => {
                  this.isAllowedRelationshipCreating = false;
                });
              } else {
                this.isAllowedRelationshipCreating = false;
              }
            }

            //  add to imports JoinTable, ManyToMany
            //  change relationship at second entity without JoinTable,
            //  if there is another JoinTable, drop it
          }
        }
      }

      const relationships: string = relArray.join('');

      let imports = '';
      if (importsArray.length > 0)
        imports = `import {${importsArray.join(', ')}} from 'typeorm'`;

      let entityImports = '';

      if (entityImportsArray.length > 0) {
        entityImportsArray.forEach((entity) => {
          const entityFileName: string = entity
            .split(/(?=[A-Z])/)
            .map((item) => item.toLowerCase())
            .join('_');

          entityImports += `import {${entity}} from './${entityFileName}.entity';\n`;
        });
      }

      const content = getStringEntity(
        imports,
        model,
        Model,
        cols.join(''),
        relationships,
        entityImports,
      );

      //this.logger.debug(content, data.name);

      if (
        data.isEditedEntity &&
        data.originalEntityName !== undefined &&
        data.originalEntityName !== this.firstTableName
      ) {
        /*this.logger.log(
          'check',
          data.originalEntityName !== undefined,
          data.originalEntityName !== this.firstTableName,
        );*/

        const ifTableExists = await conn.manager.query(`
                SELECT EXISTS (
                    SELECT 
                        name
                    FROM 
                        sqlite_schema 
                    WHERE 
                        type='table' AND 
                        name='${data.originalEntityName}'
                );`);

        const count = ifTableExists[0][Object.keys(ifTableExists[0])[0]];
        //this.logger.warn(JSON.stringify(count, null, 4), 'check');

        if (count === 1) {
          const table = await conn.getTable(data.originalEntityName);
          await Promise.all([
            fsPromises.rename(
              `${projectUrl}/src/server/entity/${data.originalEntityName}.entity.ts`,
              `${projectUrl}/src/server/entity/${model}.entity.ts`,
            ),
            conn.dropForeignKeys(data.originalEntityName, table.foreignKeys),
            conn.dropTable(data.originalEntityName),
          ]);
        } else {
          await fsPromises.rename(
            `${projectUrl}/src/server/entity/${data.originalEntityName}.entity.ts`,
            `${projectUrl}/src/server/entity/${model}.entity.ts`,
          );
        }
        //this.logger.log(`${data.originalEntityName} ${model}`);
      } else {
        /*this.logger.log(
          `WriteFile: originalEntityName: ${data.originalEntityName} Model: ${model} Data.isEditedEntity: ${data.isEditedEntity}`,
        );*/
      }

      //experimentary if
      if (!this.entityArr.some((e) => e.model === model)) {
        this.entityArr.push({ model: model, content: content });
      }

      this.logger.log('check data', content);
      return { data: content };
    } catch (e: any) {
      this.logger.error(e?.stack);
    } finally {
      await conn.release();
    }
  }

  async _createEntityFile(data: Data): Promise<{ data: string }> {
    const projectUrl = this.pathsService.getProcessProjectUrl();
    const conn = this.dataSource.createQueryRunner();

    const isDuplicate = (table) => {
      let isDuplicate = false;
      if (this.entityArr.length > 0) {
        const valueArr = this.entityArr.map((item) => {
          return item.model;
        });
        //this.logger.log(JSON.stringify(valueArr, null, 4));

        isDuplicate = valueArr.includes(table);
        /*isDuplicate = valueArr.some((item, idx) => {
					//this.logger.log(`valueArr.indexOf(item): ${valueArr.indexOf(item)} item: ${item} idx: ${idx} valueArr.indexOf(item) != idx: ${valueArr.indexOf(item) != idx}`);
					return valueArr.indexOf(item) != idx;
				});*/
      }

      return isDuplicate;
    };

    const areTwoOrMoreDuplicate = (table) => {
      let isDuplicate = false;
      if (this.entityArr.length > 0) {
        const valueArr = this.entityArr.map((item) => {
          return item.model;
        });
        //this.logger.log(JSON.stringify(valueArr, null, 4));

        //isDuplicate = valueArr.includes(table);
        isDuplicate = valueArr.some((item, idx) => {
          /*this.logger.log(
            `valueArr.indexOf(item): ${valueArr.indexOf(
              item,
            )} item: ${item} idx: ${idx} valueArr.indexOf(item) != idx: ${
              valueArr.indexOf(item) != idx
            }`,
          );*/
          return valueArr.indexOf(item) != idx;
        });
      }

      return isDuplicate;
    };

    try {
      //const conn = getConnection();

      const model = data.name.toLowerCase();
      const Model = capitalizeFirstLetter(data.name);

      let importsArray = [];

      const cols: string[] = data.columns.map((item: Column, index: number) => {
        //const additionalProperties = `${!item.notNull ? 'nullable: true,' : ''}${item.unique ? '\nunique: true' : ''}`;
        const additionalProperties =
          (!item.notNull ? '\n   nullable: true,' : '') +
          (item.unique ? '\n   unique: true' : '');

        //const parameters = datatypes[item.datatype]() === 'number' ? datatypes[item.datatype]() : `${datatypes[item.datatype]()}`;
        //this.logger.debug(item);

        const column =
          columnString(item, datatypes, additionalProperties) +
          (data.columns.length - 1 === index ? '' : '\n');
        //imports = `${item.index ? `import {Index} from "typeorm";` : ''}`;

        if (!importsArray.includes('Index')) importsArray.push('Index');

        return column;
      });

      enum RelationshipType {
        'ONE_TO_ONE' = 'OneToOne',
        'ONE_TO_MANY' = 'OneToMany',
        'MANY_TO_ONE' = 'ManyToOne',
        'MANY_TO_MANY' = 'ManyToMany',
      }
      const relArray = [];

      const entityImportsArray = [];

      //this.logger.debug(data.relationships);

      data.relationships.forEach(async (item: Relationship, index) => {
        //this.logger.log(`isDuplicate ${isDuplicate(model)}`);

        const tableName = data.relationships[index].table;
        if (tableName !== '') {
          /*this.logger.log(
            item.type[0],
            item.type === RelationshipType.ONE_TO_MANY,
            RelationshipType.ONE_TO_MANY
          );*/
          let rel = '';
          const entity = capitalizeFirstLetter(item.table);
          if (item.type === RelationshipType.ONE_TO_ONE) {
            rel = `
  @JoinColumn()
  @${item.type}(() => ${entity})
  ${item.table}: ${entity};
`;
            importsArray = [...importsArray, item.type, 'JoinColumn'];

            relArray.push(rel);

            entityImportsArray.push(entity);

            //  add to imports OneToOne, JoinColumn
          }

          if (item.type === RelationshipType.ONE_TO_MANY) {
            rel = `
  @${item.type}(() => ${entity}, (${item.table}) => ${item.table}.${model})
  ${item.table}s: ${entity}[];
`;
            //this.logger.log('item.type === RelationshipType.ONE_TO_MANY');
            !importsArray.includes(item.type) && importsArray.push(item.type);
            relArray.push(rel);
            entityImportsArray.push(entity);
            /*this.logger.log(
              this.isAllowedRelationshipCreating,
              'this.isAllowedRelationshipCreating',
            );*/

            if (!isDuplicate(model)) {
              //this.logger.log('this.isAllowedRelationshipCreating after');
              const data: Data = (await this.getEntityDataForView(tableName))
                .data;
              data.relationships = [
                ...data.relationships,
                { table: model, type: RelationshipType.MANY_TO_ONE },
              ];
              //this.isAllowedRelationshipCreating = false;
              this.createEntityFile(data).then(
                () => (this.isAllowedRelationshipCreating = false),
              );
            }

            //  add to imports OneToMany
            //  change relationship at second entity
          }

          if (item.type === RelationshipType.MANY_TO_ONE) {
            rel = `
  @${item.type}(() => ${entity}, (${item.table}) => ${item.table}.${model}s)
  ${item.table}: ${entity};
`;
            !importsArray.includes(item.type) && importsArray.push(item.type);
            relArray.push(rel);
            entityImportsArray.push(entity);
            if (!isDuplicate(model)) {
              const data: Data = (await this.getEntityDataForView(tableName))
                .data;

              data.relationships = [
                ...data.relationships,
                { table: model, type: RelationshipType.ONE_TO_MANY },
              ];
              this.createEntityFile(data).then(
                () => (this.isAllowedRelationshipCreating = false),
              );
            }
          }
          //  add to imports ManyToOne
          //  change relationship at second entity

          if (item.type === RelationshipType.MANY_TO_MANY) {
            const secondData: Data = (await this.getEntityDataForView(model))
              .data;

            let isNeedImportingJoinTable = true;

            secondData.relationships.forEach((item) => {
              if (
                item.type === RelationshipType.MANY_TO_MANY &&
                item.table === model
              ) {
                isNeedImportingJoinTable = false;
              }
            });

            rel = `
  ${isNeedImportingJoinTable ? '@JoinTable()' : ''}                    
  @${item.type}(() => ${entity}, (${item.table}) => ${item.table}.${model}s)
  ${item.table}s: ${entity}[];
`;
            importsArray = [...importsArray, item.type, 'JoinTable'];
            relArray.push(rel);
            //this.logger.log({ relArray });
            entityImportsArray.push(entity);
            if (!areTwoOrMoreDuplicate(model)) {
              const data: Data = (await this.getEntityDataForView(tableName))
                .data;
              //this.logger.log('!(areTwoOrMoreDuplicate(model))');
              //data.relationships = [...data.relationships, { table: model, type: RelationshipType.MANY_TO_MANY }]
              //data.relationships[0].table === ''
              //? data.relationships = [{ table: model, type: RelationshipType.MANY_TO_MANY }]
              data.relationships = [
                ...data.relationships,
                { table: model, type: RelationshipType.MANY_TO_MANY },
              ];
              //this.logger.warn(this.isAllowedRelationshipCreating);
              this.createEntityFile(data).then(() => {
                this.isAllowedRelationshipCreating = false;
              });
            }

            //  add to imports JoinTable, ManyToMany
            //  change relationship at second entity without JoinTable,
            //      if there is another JoinTable, drop it
          }
        }
      });

      const relationships: string = relArray.join('\n');
      //this.logger.log('xdwawaddwadwa', { relArray });
      //let relationships: string = '';

      let imports = '';
      if (importsArray.length > 0)
        imports = `import {${importsArray.join(', ')}} from 'typeorm'`;

      let entityImports = '';

      if (entityImportsArray.length > 0) {
        entityImportsArray.forEach((entity) => {
          const file = entity.toLowerCase();
          if (!entityImports.includes(entity))
            entityImports += `import {${entity}} from './${file}.entity';\n`;
        });
      }

      const content = getStringEntity(
        imports,
        model,
        Model,
        cols.join(''),
        relationships,
        entityImports,
      );

      //this.logger.debug(content, data.name);

      //if (data.isEditedEntity && data.originalEntityName !== '') {
      if (
        data.isEditedEntity &&
        data.originalEntityName !== undefined &&
        data.originalEntityName !== this.firstTableName
      ) {
        /*this.logger.log(
          'check',
          data.originalEntityName !== undefined,
          data.originalEntityName !== this.firstTableName,
        );*/
        const ifTableExists = await conn.manager.query(`
                SELECT EXISTS (
                    SELECT 
                        name
                    FROM 
                        sqlite_schema 
                    WHERE 
                        type='table' AND 
                        name='${data.originalEntityName}'
                );`);

        const count = ifTableExists[0][Object.keys(ifTableExists[0])[0]];
        //this.logger.warn(JSON.stringify(count, null, 4), 'check');

        if (count === 1) {
          await Promise.all([
            fsPromises.rename(
              `${projectUrl}/src/server/entity/${data.originalEntityName}.entity.ts`,
              `${projectUrl}/src/server/entity/${model}.entity.ts`,
            ),
            conn.query(`DROP TABLE '${data.originalEntityName}'`),
          ]);
        } else {
          await fsPromises.rename(
            `${projectUrl}/src/server/entity/${data.originalEntityName}.entity.ts`,
            `${projectUrl}/src/server/entity/${model}.entity.ts`,
          );
        }
        //this.logger.log(`${data.originalEntityName} ${model}`);
        /*await fsPromises.writeFile(
					`${projectUrl}/src/server/entity/${model}.entity.ts`,
					content,
					'utf8',
				);*/
      } else {
        /*this.logger.log(
          `WriteFile: originalEntityName: ${data.originalEntityName} Model: ${model} Data.isEditedEntity: ${data.isEditedEntity}`,
        );*/
      }

      /*if (!(!!this.content && !!this.model)) {
				this.content = content;
				this.model = model;
			}*/
      //!(isDuplicate(model)) ? this.entityArr.push({ model: model, content: content }) : null;

      this.entityArr = this.entityArr.filter((item, i) => {
        const indexes: number[] = [];
        let itemxx: number | null = null;
        if (areTwoOrMoreDuplicate(item.model)) {
          const duplicatedItems = this.entityArr.filter((itemx, index) => {
            const condition = itemx.model === item.model;
            condition ? indexes.push(index) : null;
            return condition;
          });

          const dataLengthItem: { lengthx: number; index: number }[] = [];

          duplicatedItems.filter(async (itemy, index) => {
            const data: Data = (await this.getEntityDataForView(itemy.model))
              .data;

            dataLengthItem.push({
              lengthx: data.relationships.length,
              index: indexes[index],
            });
          });

          //this.logger.warn(JSON.stringify(dataLengthItem, null, 4), 'debug');
          let long1 = 0;

          function longestString(arr: { lengthx: number; index: number }[]) {
            let itemt = arr[0];
            for (i = 0; i < arr.length; i++) {
              if (arr[i].lengthx > long1) {
                long1 = arr[i].lengthx;
                itemt = arr[i];
              }
            }

            return itemt;
          }

          itemxx = longestString(dataLengthItem).index;
        }

        return itemxx === i;
      });

      // !isDuplicate(model) ? this.entityArr.push({ model: model, content: content }) : null;
      this.entityArr.push({ model: model, content: content });

      //this.entityArr.push({ model: model, content: content })

      return { data: content };
    } catch (e: any) {
      //this.logger.error(e?.stack);
    } finally {
      await conn.release();
    }
  }

  async finishGeneratingEntityFile() {
    const projectUrl = this.pathsService.getProcessProjectUrl();
    //this.logger.warn(this.content, 'this.content');
    /*this.logger.log(
      'finishGeneratingEntityFile',
      JSON.stringify(this.entityArr, null, 4),
    );*/

    this.entityArr.forEach(async (item, index) => {
      const content = item.content;
      //this.logger.log(content, index + 1);
      await fsPromises.writeFile(
        `${projectUrl}/src/server/entity/${item.model}.entity.ts`,
        item.content,
        'utf8',
      );
    });

    this.isAllowedRelationshipCreating = true;
    this.entityArr = [];
    this.firstTableName = '';
    /*
		if (!!this.secondModel && !!this.secondContent) {
			//this.logger.log('if !!this.secondModel && !!this.secondContent')
			//this.logger.log(this.secondContent, 'this.secondContent')
			await fsPromises.writeFile(
				`${projectUrl}/src/server/entity/${this.secondModel}.entity.ts`,
				this.secondContent,
				'utf8',
			);
    
			//this.logger.log('finishGeneratingEntityFile !!this.secondModel && !!this.secondContent')
		}
		*/
  }

  async getEntityData(): Promise<
    { entityName: string; filename: string; table: string }[]
  > {
    const projectUrl = this.pathsService.getProcessProjectUrl();
    const rootUrl = this.pathsService.getRootUrl();

    const items: { entityName: string; filename: string; table: string }[] = [];
    const checkIfDuplicateItems: string[] = [];

    /*this.logger.warn(
      'if exists rooturl with entities ' +
        fs.existsSync(`${rootUrl}/server/entity`),
    );*/

    function getDataFromEntityDir() {
      const srcEntityFiles: string[] = fs.readdirSync(
        `${projectUrl}/src/server/entity`,
      );

      if (srcEntityFiles.length > 0) {
        srcEntityFiles.forEach((file, i) => {
          const table = file.split('.')[0];

          const entityName = capitalizeFirstLetter(
            table
              .split('_')
              .map((item) => capitalizeFirstLetter(item))
              .join(''),
          );

          //capitalizeFirstLetter(table);
          const fileName = `${table}.entity.ts`;

          if (checkIfDuplicateItems.indexOf(entityName) === -1) {
            items.push({
              entityName: entityName,
              filename: fileName,
              table: table,
            });
            checkIfDuplicateItems.push(entityName);
          }
        });
      }
    }

    if (fs.existsSync(`${rootUrl}/server/entity`)) {
      /*this.logger.debug(
        fs.existsSync(`${rootUrl}/server/entity`),
        'if exists rootUrl',
      );*/
      //this.logger.debug(`${rootUrl}/server/entity`, 'if exists rootUrl');

      const distEntityFiles: string[] = fs.readdirSync(
        `${rootUrl}/server/entity`,
      );

      if (distEntityFiles.length > 0) {
        distEntityFiles.forEach((file, i) => {
          const table = file.split('.')[0];
          //const entityName = capitalizeFirstLetter(table);
          const entityName: string = table
            .split('_')
            .map((item) => capitalizeFirstLetter(item))
            .join('');
          const fileName = `${table}.entity.ts`;

          if (checkIfDuplicateItems.indexOf(entityName) === -1) {
            items.push({
              entityName: entityName,
              filename: fileName,
              table: table,
            });
            checkIfDuplicateItems.push(entityName);
          }
        });
      } else {
        getDataFromEntityDir();
      }
    } else {
      getDataFromEntityDir();
    }

    return items;
  }

  async deleteEntity(entityName: string): Promise<void> {
    //const fileToDelete = entityName.split('.')[0];
    const projectUrl = this.pathsService.getProcessProjectUrl();
    const rootUrl = this.pathsService.getRootUrl();
    const conn = this.dataSource.createQueryRunner();
    try {
      const fileToDelete = entityName.split('.')[0];

      if (fs.existsSync(rootUrl)) {
        const distEntityFiles: string[] = fs.readdirSync(
          `${rootUrl}/server/entity`,
        );

        if (distEntityFiles.length > 0) {
          distEntityFiles.forEach(async (file, i) => {
            const table = file.split('.')[0];

            /*this.logger.warn(
              entityName,
              fs.existsSync(`${projectUrl}/src/server/entity/${entityName}`) +
                '',
            );*/
            if (table === fileToDelete) {
              await fsPromises.unlink(`${rootUrl}/server/entity/${file}`);
            }
          });
        }
      }

      if (fs.existsSync(`${projectUrl}/src/server/entity/${entityName}`)) {
        await fsPromises.unlink(
          `${projectUrl}/src/server/entity/${entityName}`,
        );
        //await conn.query(`DROP TABLE '${fileToDelete}'`)

        const table = await conn.getTable(fileToDelete);

        await conn.dropForeignKeys(fileToDelete, table.foreignKeys);
        await conn.dropTable(fileToDelete);
      }

      //const data = await this.getEntityData();
      //this.gateway.wss.emit('entities', data);
      //this.entitygenGateway.wss.emit('entities', data);
    } catch (e: any) {
      //this.logger.error(e?.stack);
    } finally {
      await conn.release();
    }
  }
}
