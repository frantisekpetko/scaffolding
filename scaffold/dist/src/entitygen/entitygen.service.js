"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EntitygenService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitygenService = void 0;
const fs_1 = __importDefault(require("fs"));
const common_1 = require("@nestjs/common");
const fs_2 = require("fs");
const string_functions_1 = require("../utils/string.functions");
const typeorm_1 = require("typeorm");
const paths_service_1 = require("./paths/paths.service");
const stringmaterials_1 = require("./stringmaterials");
let EntitygenService = EntitygenService_1 = class EntitygenService {
    constructor(pathsService, dataSource) {
        this.pathsService = pathsService;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(EntitygenService_1.name);
        this.firstTableName = '';
        this.data = null;
        this.entityArr = [];
        this.isAllowedRelationshipCreating = true;
    }
    onModuleInit() {
    }
    setChangedDataToNull() {
        this.data = null;
    }
    async getEntityDataForView(entityName) {
        const projectUrl = this.pathsService.getProcessProjectUrl();
        let RelationshipType;
        (function (RelationshipType) {
            RelationshipType["ONE_TO_ONE"] = "OneToOne";
            RelationshipType["ONE_TO_MANY"] = "OneToMany";
            RelationshipType["MANY_TO_ONE"] = "ManyToOne";
            RelationshipType["MANY_TO_MANY"] = "ManyToMany";
        })(RelationshipType || (RelationshipType = {}));
        const data = {
            name: '',
            columns: [],
            relationships: [],
        };
        if (fs_1.default.existsSync(`${projectUrl}/src/server/entity/${entityName}.entity.ts`)) {
            const txt = await fs_2.promises.readFile(`${projectUrl}/src/server/entity/${entityName}.entity.ts`, 'utf8');
            const txtWithoutWhiteSpace = txt.replace(/ /g, '').replace(/\n/g, '');
            const txtArray = txtWithoutWhiteSpace
                .split(';')
                .map((item) => item + ';');
            const columnTxtArray = txtArray.filter((item) => item.startsWith('@Index') || item.startsWith('@Column'));
            const relTxtArray = txtArray.filter((item) => item.startsWith(`@${RelationshipType.ONE_TO_ONE}`) ||
                item.startsWith(`@${RelationshipType.ONE_TO_MANY}`) ||
                item.startsWith(`@${RelationshipType.MANY_TO_ONE}`) ||
                item.startsWith(`@${RelationshipType.MANY_TO_MANY}`) ||
                item.startsWith(`@JoinColumn`) ||
                item.startsWith(`@JoinTable`));
            const tableName = stringmaterials_1.getFromBetween.get(txtWithoutWhiteSpace, '@Entity({name:', '})');
            data.name = tableName[0].replace(/'/g, '');
            data.name = (0, string_functions_1.capitalizeFirstLetter)(data.name
                .split('_')
                .map((item) => (0, string_functions_1.capitalizeFirstLetter)(item))
                .join(''));
            const columnData = stringmaterials_1.getFromBetween.get(txtWithoutWhiteSpace, '@Column({', '})');
            const columns = [];
            const relationships = [];
            const entireColumnData = stringmaterials_1.getFromBetween.get(txtWithoutWhiteSpace, '@Column({', ';@');
            columnTxtArray.forEach((element) => {
                let isUnique = stringmaterials_1.getFromBetween.get(element + ':', 'unique:', ':');
                isUnique = isUnique.length < 1 ? false : Boolean(isUnique);
                const datatype = stringmaterials_1.getFromBetween.get(element, 'type:"', '"')[0] === 'int'
                    ? 'integer'
                    : stringmaterials_1.getFromBetween.get(element, 'type:"', '"')[0];
                let notNull = stringmaterials_1.getFromBetween.get(element + ':', 'nullable:', ':');
                notNull = !(notNull.length < 1) ? false : Boolean(notNull);
                let columnName = stringmaterials_1.getFromBetween
                    .get(element, '})', ';')[0]
                    .split(':')[0];
                if (columnName.charAt(columnName.length - 1) === '!') {
                    columnName = columnName.substring(0, columnName.length - 1);
                }
                const isIndex = element.startsWith('@Index()');
                columns.push({
                    nameOfColumn: columnName,
                    notNull: notNull,
                    unique: isUnique,
                    index: isIndex,
                    datatype: datatype,
                });
            });
            relTxtArray.forEach((element) => {
                const [relType] = stringmaterials_1.getFromBetween
                    .get(element, '@', '(()=>')[0]
                    .startsWith('JoinTable()@')
                    ? stringmaterials_1.getFromBetween.get(element, '@JoinTable()@', '(()=>')
                    : stringmaterials_1.getFromBetween.get(element, '@', '(()=>');
                const entity = (stringmaterials_1.getFromBetween.get(element, '(()=>', ',') + '')
                    .split(/(?=[A-Z])/)
                    .map((item) => item.toLocaleLowerCase())
                    .join('_');
                relationships.push({
                    type: relType,
                    table: entity + '',
                });
            });
            data.columns = [...columns];
            if (relationships.length === 0) {
                data.relationships = [
                    {
                        type: 'OneToOne',
                        table: '',
                    },
                ];
            }
            else {
                data.relationships = [...relationships];
            }
        }
        return { data: data };
    }
    async createEntityFile(data) {
        const projectUrl = this.pathsService.getProcessProjectUrl();
        const conn = this.dataSource.createQueryRunner();
        if (!this.data) {
            this.data = data;
            this.logger.debug('set default data', JSON.stringify(this.data, null, 4));
        }
        if (this.firstTableName === '') {
            this.firstTableName = data.name;
        }
        const getModel = (entityName) => entityName
            .split(/(?=[A-Z])/)
            .map((item) => item.toLowerCase())
            .join('_');
        const unchangedData = (await this.getEntityDataForView(getModel(this.data.name))).data;
        const isAllowedFileWriting = async (tableName, entity) => {
            const oppositeData = (await this.getEntityDataForView(tableName))
                .data;
            return oppositeData.relationships.every((item) => item.table !== entity);
        };
        const getDataWithDeletingPreviousConnectedRelationships = async (tableName, changedData) => {
            const oppositeData = (await this.getEntityDataForView(tableName))
                .data;
            const unchangedEntityData = (await this.getEntityDataForView(getModel(this.data.name))).data;
            this.logger.debug('[getDataWithDeletingPreviousConnectedRelationships] changedData', changedData);
            let missingItems = [];
            missingItems = unchangedData.relationships.filter((unchangedItem) => changedData.relationships.every((item) => item.table !== unchangedItem.table &&
                item.type !== unchangedItem.type));
            this.logger.debug(`missingItems ${data.name}`, JSON.stringify(missingItems, null, 4));
            if (missingItems.length > 0) {
                oppositeData.relationships = [
                    ...oppositeData.relationships.filter((item) => {
                        return missingItems.every((missingItem) => missingItem.table !== item.table);
                    }),
                ];
            }
            return oppositeData;
        };
        try {
            const model = data.name
                .split(/(?=[A-Z])/)
                .map((item) => item.toLowerCase())
                .join('_');
            const Model = (0, string_functions_1.capitalizeFirstLetter)(data.name);
            let importsArray = [];
            const cols = data.columns.map((item) => {
                const additionalProperties = (!item.notNull ? '\n   nullable: true,' : '') +
                    (item.unique ? '\n   unique: true' : '');
                const column = (0, stringmaterials_1.columnString)(item, stringmaterials_1.datatypes, additionalProperties);
                if (!importsArray.includes('Index'))
                    importsArray.push('Index');
                return column;
            });
            let RelationshipType;
            (function (RelationshipType) {
                RelationshipType["ONE_TO_ONE"] = "OneToOne";
                RelationshipType["ONE_TO_MANY"] = "OneToMany";
                RelationshipType["MANY_TO_ONE"] = "ManyToOne";
                RelationshipType["MANY_TO_MANY"] = "ManyToMany";
            })(RelationshipType || (RelationshipType = {}));
            const relArray = [];
            const entityImportsArray = [];
            const dataRelArray = unchangedData.name === data.name &&
                unchangedData.relationships.length > data.relationships.length &&
                fs_1.default.existsSync(`${projectUrl}/src/server/entity/${getModel(data.name)}.entity.ts`)
                ? unchangedData.relationships ?? []
                : data.relationships;
            for (const item of dataRelArray) {
                const index = data.relationships.indexOf(item);
                const tableName = data.relationships[index].table;
                if (tableName !== '') {
                    let rel = '';
                    const entity = (0, string_functions_1.capitalizeFirstLetter)(item.table);
                    const _entity = (0, string_functions_1.capitalizeFirstLetter)(entity
                        .split('_')
                        .map((item) => (0, string_functions_1.capitalizeFirstLetter)(item))
                        .join(''));
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
                    }
                    if (item.type === RelationshipType.ONE_TO_MANY) {
                        const _entity = (0, string_functions_1.capitalizeFirstLetter)(entity
                            .split('_')
                            .map((item) => (0, string_functions_1.capitalizeFirstLetter)(item))
                            .join(''));
                        rel = `
  @${item.type}(() => ${_entity}, (${item.table}) => ${item.table}.${model})
  ${item.table}s: ${_entity}[];
`;
                        !importsArray.includes(item.type) && importsArray.push(item.type);
                        !relArray.includes(rel) && relArray.push(rel);
                        !entityImportsArray.includes(entity) &&
                            entityImportsArray.push(_entity);
                        if (this.isAllowedRelationshipCreating &&
                            (this.data.name === data.name ||
                                (await isAllowedFileWriting(tableName, this.data.name)))) {
                            const data = await getDataWithDeletingPreviousConnectedRelationships(tableName, this.data);
                            if (!!data.name &&
                                data.columns.length > 0 &&
                                data.relationships.length > 0) {
                                data.relationships = [
                                    ...data.relationships,
                                    { table: model, type: RelationshipType.MANY_TO_ONE },
                                ];
                                this.createEntityFile(data).then(() => (this.isAllowedRelationshipCreating = false));
                            }
                            else {
                                this.isAllowedRelationshipCreating = false;
                            }
                        }
                    }
                    if (item.type === RelationshipType.MANY_TO_ONE) {
                        const _entity = (0, string_functions_1.capitalizeFirstLetter)(entity
                            .split('_')
                            .map((item) => (0, string_functions_1.capitalizeFirstLetter)(item))
                            .join(''));
                        rel = `
  @${item.type}(() => ${_entity}, (${item.table}) => ${item.table}.${model}s)
  ${item.table}: ${_entity};
`;
                        !importsArray.includes(item.type) && importsArray.push(item.type);
                        !relArray.includes(rel) && relArray.push(rel);
                        !entityImportsArray.includes(entity) &&
                            entityImportsArray.push(_entity);
                        if (this.isAllowedRelationshipCreating &&
                            (this.data.name === data.name ||
                                (await isAllowedFileWriting(tableName, this.data.name)))) {
                            const data = await getDataWithDeletingPreviousConnectedRelationships(tableName, this.data);
                            if (!!data.name &&
                                data.columns.length > 0 &&
                                data.relationships.length > 0) {
                                data.relationships = [
                                    ...data.relationships,
                                    { table: model, type: RelationshipType.ONE_TO_MANY },
                                ];
                                this.createEntityFile(data).then(() => (this.isAllowedRelationshipCreating = false));
                            }
                            else {
                                this.isAllowedRelationshipCreating = false;
                            }
                        }
                    }
                    if (item.type === RelationshipType.MANY_TO_MANY) {
                        const _entity = (0, string_functions_1.capitalizeFirstLetter)(entity
                            .split('_')
                            .map((item) => (0, string_functions_1.capitalizeFirstLetter)(item))
                            .join(''));
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
                        if (this.isAllowedRelationshipCreating &&
                            (this.data.name === data.name ||
                                (await isAllowedFileWriting(tableName, this.data.name)))) {
                            const data = await getDataWithDeletingPreviousConnectedRelationships(tableName, this.data);
                            if (!!data.name &&
                                data.columns.length > 0 &&
                                data.relationships.length > 0) {
                                data.relationships = [
                                    ...data.relationships,
                                    { table: model, type: RelationshipType.MANY_TO_MANY },
                                ];
                                this.createEntityFile(data).then(() => {
                                    this.isAllowedRelationshipCreating = false;
                                });
                            }
                            else {
                                this.isAllowedRelationshipCreating = false;
                            }
                        }
                    }
                }
            }
            const relationships = relArray.join('');
            let imports = '';
            if (importsArray.length > 0)
                imports = `import {${importsArray.join(', ')}} from 'typeorm'`;
            let entityImports = '';
            if (entityImportsArray.length > 0) {
                entityImportsArray.forEach((entity) => {
                    const entityFileName = entity
                        .split(/(?=[A-Z])/)
                        .map((item) => item.toLowerCase())
                        .join('_');
                    entityImports += `import {${entity}} from './${entityFileName}.entity';\n`;
                });
            }
            const content = (0, stringmaterials_1.getStringEntity)(imports, model, Model, cols.join(''), relationships, entityImports);
            if (data.isEditedEntity &&
                data.originalEntityName !== undefined &&
                data.originalEntityName !== this.firstTableName) {
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
                if (count === 1) {
                    const table = await conn.getTable(data.originalEntityName);
                    await Promise.all([
                        fs_2.promises.rename(`${projectUrl}/src/server/entity/${data.originalEntityName}.entity.ts`, `${projectUrl}/src/server/entity/${model}.entity.ts`),
                        conn.dropForeignKeys(data.originalEntityName, table.foreignKeys),
                        conn.dropTable(data.originalEntityName),
                    ]);
                }
                else {
                    await fs_2.promises.rename(`${projectUrl}/src/server/entity/${data.originalEntityName}.entity.ts`, `${projectUrl}/src/server/entity/${model}.entity.ts`);
                }
            }
            else {
            }
            if (!this.entityArr.some((e) => e.model === model)) {
                this.entityArr.push({ model: model, content: content });
            }
            this.logger.log('check data', content);
            return { data: content };
        }
        catch (e) {
            this.logger.error(e?.stack);
        }
        finally {
            await conn.release();
        }
    }
    async _createEntityFile(data) {
        const projectUrl = this.pathsService.getProcessProjectUrl();
        const conn = this.dataSource.createQueryRunner();
        const isDuplicate = (table) => {
            let isDuplicate = false;
            if (this.entityArr.length > 0) {
                const valueArr = this.entityArr.map((item) => {
                    return item.model;
                });
                isDuplicate = valueArr.includes(table);
            }
            return isDuplicate;
        };
        const areTwoOrMoreDuplicate = (table) => {
            let isDuplicate = false;
            if (this.entityArr.length > 0) {
                const valueArr = this.entityArr.map((item) => {
                    return item.model;
                });
                isDuplicate = valueArr.some((item, idx) => {
                    return valueArr.indexOf(item) != idx;
                });
            }
            return isDuplicate;
        };
        try {
            const model = data.name.toLowerCase();
            const Model = (0, string_functions_1.capitalizeFirstLetter)(data.name);
            let importsArray = [];
            const cols = data.columns.map((item, index) => {
                const additionalProperties = (!item.notNull ? '\n   nullable: true,' : '') +
                    (item.unique ? '\n   unique: true' : '');
                const column = (0, stringmaterials_1.columnString)(item, stringmaterials_1.datatypes, additionalProperties) +
                    (data.columns.length - 1 === index ? '' : '\n');
                if (!importsArray.includes('Index'))
                    importsArray.push('Index');
                return column;
            });
            let RelationshipType;
            (function (RelationshipType) {
                RelationshipType["ONE_TO_ONE"] = "OneToOne";
                RelationshipType["ONE_TO_MANY"] = "OneToMany";
                RelationshipType["MANY_TO_ONE"] = "ManyToOne";
                RelationshipType["MANY_TO_MANY"] = "ManyToMany";
            })(RelationshipType || (RelationshipType = {}));
            const relArray = [];
            const entityImportsArray = [];
            data.relationships.forEach(async (item, index) => {
                const tableName = data.relationships[index].table;
                if (tableName !== '') {
                    let rel = '';
                    const entity = (0, string_functions_1.capitalizeFirstLetter)(item.table);
                    if (item.type === RelationshipType.ONE_TO_ONE) {
                        rel = `
  @JoinColumn()
  @${item.type}(() => ${entity})
  ${item.table}: ${entity};
`;
                        importsArray = [...importsArray, item.type, 'JoinColumn'];
                        relArray.push(rel);
                        entityImportsArray.push(entity);
                    }
                    if (item.type === RelationshipType.ONE_TO_MANY) {
                        rel = `
  @${item.type}(() => ${entity}, (${item.table}) => ${item.table}.${model})
  ${item.table}s: ${entity}[];
`;
                        !importsArray.includes(item.type) && importsArray.push(item.type);
                        relArray.push(rel);
                        entityImportsArray.push(entity);
                        if (!isDuplicate(model)) {
                            const data = (await this.getEntityDataForView(tableName))
                                .data;
                            data.relationships = [
                                ...data.relationships,
                                { table: model, type: RelationshipType.MANY_TO_ONE },
                            ];
                            this.createEntityFile(data).then(() => (this.isAllowedRelationshipCreating = false));
                        }
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
                            const data = (await this.getEntityDataForView(tableName))
                                .data;
                            data.relationships = [
                                ...data.relationships,
                                { table: model, type: RelationshipType.ONE_TO_MANY },
                            ];
                            this.createEntityFile(data).then(() => (this.isAllowedRelationshipCreating = false));
                        }
                    }
                    if (item.type === RelationshipType.MANY_TO_MANY) {
                        const secondData = (await this.getEntityDataForView(model))
                            .data;
                        let isNeedImportingJoinTable = true;
                        secondData.relationships.forEach((item) => {
                            if (item.type === RelationshipType.MANY_TO_MANY &&
                                item.table === model) {
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
                        entityImportsArray.push(entity);
                        if (!areTwoOrMoreDuplicate(model)) {
                            const data = (await this.getEntityDataForView(tableName))
                                .data;
                            data.relationships = [
                                ...data.relationships,
                                { table: model, type: RelationshipType.MANY_TO_MANY },
                            ];
                            this.createEntityFile(data).then(() => {
                                this.isAllowedRelationshipCreating = false;
                            });
                        }
                    }
                }
            });
            const relationships = relArray.join('\n');
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
            const content = (0, stringmaterials_1.getStringEntity)(imports, model, Model, cols.join(''), relationships, entityImports);
            if (data.isEditedEntity &&
                data.originalEntityName !== undefined &&
                data.originalEntityName !== this.firstTableName) {
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
                if (count === 1) {
                    await Promise.all([
                        fs_2.promises.rename(`${projectUrl}/src/server/entity/${data.originalEntityName}.entity.ts`, `${projectUrl}/src/server/entity/${model}.entity.ts`),
                        conn.query(`DROP TABLE '${data.originalEntityName}'`),
                    ]);
                }
                else {
                    await fs_2.promises.rename(`${projectUrl}/src/server/entity/${data.originalEntityName}.entity.ts`, `${projectUrl}/src/server/entity/${model}.entity.ts`);
                }
            }
            else {
            }
            this.entityArr = this.entityArr.filter((item, i) => {
                const indexes = [];
                let itemxx = null;
                if (areTwoOrMoreDuplicate(item.model)) {
                    const duplicatedItems = this.entityArr.filter((itemx, index) => {
                        const condition = itemx.model === item.model;
                        condition ? indexes.push(index) : null;
                        return condition;
                    });
                    const dataLengthItem = [];
                    duplicatedItems.filter(async (itemy, index) => {
                        const data = (await this.getEntityDataForView(itemy.model))
                            .data;
                        dataLengthItem.push({
                            lengthx: data.relationships.length,
                            index: indexes[index],
                        });
                    });
                    let long1 = 0;
                    function longestString(arr) {
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
            this.entityArr.push({ model: model, content: content });
            return { data: content };
        }
        catch (e) {
        }
        finally {
            await conn.release();
        }
    }
    async finishGeneratingEntityFile() {
        const projectUrl = this.pathsService.getProcessProjectUrl();
        this.entityArr.forEach(async (item, index) => {
            const content = item.content;
            await fs_2.promises.writeFile(`${projectUrl}/src/server/entity/${item.model}.entity.ts`, item.content, 'utf8');
        });
        this.isAllowedRelationshipCreating = true;
        this.entityArr = [];
        this.firstTableName = '';
    }
    async getEntityData() {
        const projectUrl = this.pathsService.getProcessProjectUrl();
        const rootUrl = this.pathsService.getRootUrl();
        const items = [];
        const checkIfDuplicateItems = [];
        function getDataFromEntityDir() {
            const srcEntityFiles = fs_1.default.readdirSync(`${projectUrl}/src/server/entity`);
            if (srcEntityFiles.length > 0) {
                srcEntityFiles.forEach((file, i) => {
                    const table = file.split('.')[0];
                    const entityName = (0, string_functions_1.capitalizeFirstLetter)(table
                        .split('_')
                        .map((item) => (0, string_functions_1.capitalizeFirstLetter)(item))
                        .join(''));
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
        if (fs_1.default.existsSync(`${rootUrl}/server/entity`)) {
            const distEntityFiles = fs_1.default.readdirSync(`${rootUrl}/server/entity`);
            if (distEntityFiles.length > 0) {
                distEntityFiles.forEach((file, i) => {
                    const table = file.split('.')[0];
                    const entityName = table
                        .split('_')
                        .map((item) => (0, string_functions_1.capitalizeFirstLetter)(item))
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
            }
            else {
                getDataFromEntityDir();
            }
        }
        else {
            getDataFromEntityDir();
        }
        return items;
    }
    async deleteEntity(entityName) {
        const projectUrl = this.pathsService.getProcessProjectUrl();
        const rootUrl = this.pathsService.getRootUrl();
        const conn = this.dataSource.createQueryRunner();
        try {
            const fileToDelete = entityName.split('.')[0];
            if (fs_1.default.existsSync(rootUrl)) {
                const distEntityFiles = fs_1.default.readdirSync(`${rootUrl}/server/entity`);
                if (distEntityFiles.length > 0) {
                    distEntityFiles.forEach(async (file, i) => {
                        const table = file.split('.')[0];
                        if (table === fileToDelete) {
                            await fs_2.promises.unlink(`${rootUrl}/server/entity/${file}`);
                        }
                    });
                }
            }
            if (fs_1.default.existsSync(`${projectUrl}/src/server/entity/${entityName}`)) {
                await fs_2.promises.unlink(`${projectUrl}/src/server/entity/${entityName}`);
                const table = await conn.getTable(fileToDelete);
                await conn.dropForeignKeys(fileToDelete, table.foreignKeys);
                await conn.dropTable(fileToDelete);
            }
        }
        catch (e) {
        }
        finally {
            await conn.release();
        }
    }
};
EntitygenService = EntitygenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [paths_service_1.PathsService, typeof (_a = typeof typeorm_1.DataSource !== "undefined" && typeorm_1.DataSource) === "function" ? _a : Object])
], EntitygenService);
exports.EntitygenService = EntitygenService;
//# sourceMappingURL=entitygen.service.js.map