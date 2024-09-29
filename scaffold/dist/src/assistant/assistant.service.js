"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AssistantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistantService = void 0;
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
const paths_service_1 = require("../entitygen/paths/paths.service");
const paths_1 = require("./../config/paths");
const entitygen_service_1 = require("./../entitygen/entitygen.service");
const common_1 = require("@nestjs/common");
let AssistantService = AssistantService_1 = class AssistantService {
    constructor(entitygenService, pathsService, dataSource) {
        this.entitygenService = entitygenService;
        this.pathsService = pathsService;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(AssistantService_1.name);
    }
    async createAllEntities(data) {
        try {
            for (const schema of data) {
                await Promise.all([
                    this.entitygenService.createEntityFile(schema),
                    this.entitygenService.finishGeneratingEntityFile(),
                ]);
            }
        }
        catch (err) {
            this.logger.error(`err ${err}`);
        }
    }
    getSrcFiles() {
        return fs_1.promises.readdir(`${paths_1.processProjectUrl}/src/server/entity`);
    }
    async recreateDatabaseSchema() {
        await this.removeTables();
        this.logger.warn('PATH', this.pathsService.getProcessProjectUrl());
        const schemaPath = path_1.default.join(this.pathsService.getProcessProjectUrl(), 'src/server/config/databaseSchema.json');
        if (fs_1.default.existsSync(schemaPath)) {
            const data = await fs_1.promises.readFile(schemaPath, 'utf-8');
            const parsedData = JSON.parse(data);
            function timeout(ms) {
                return new Promise((resolve) => setTimeout(resolve, ms));
            }
            if (parsedData.length > 0 && Array.isArray(parsedData)) {
                this.createAllEntities(parsedData);
            }
        }
        else {
            throw new common_1.InternalServerErrorException(`Database JSON schema doesn't exists! Please persist database schema first.`);
        }
    }
    async persistDatabaseSchema() {
        const entities = await this.getSrcFiles();
        const schemaArr = [];
        for (const entity of entities) {
            const entityName = entity.split('.')[0];
            this.logger.debug(entity, 'entity');
            const { data } = await this.entitygenService.getEntityDataForView(entityName);
            schemaArr.push(data);
        }
        this.logger.warn(JSON.stringify(schemaArr), 'Final schema');
        await fs_1.promises.writeFile(path_1.default.join(this.pathsService.getProcessProjectUrl(), 'src/server/config/database.schema.json'), JSON.stringify(schemaArr, null, 4), 'utf8');
    }
    async removeTables() {
        const conn = this.dataSource;
        const queryRunner = conn.createQueryRunner();
        await queryRunner.connect();
        let distDir = [];
        let srcDir = [];
        async function getDistFiles() {
            if (fs_1.default.existsSync(`${paths_1.root}/entity`)) {
                distDir = await fs_1.promises.readdir(`${paths_1.root}/entity`);
            }
            else {
                distDir = [];
            }
        }
        const getSrcFiles = async () => {
            srcDir = await this.getSrcFiles();
        };
        await Promise.all([getDistFiles(), getSrcFiles()]);
        try {
            const entities = conn.entityMetadatas;
            await queryRunner.release();
            async function removeDistFiles() {
                for (const file of distDir) {
                    await fs_1.promises.rm(`${paths_1.root}/entity/${file}`);
                }
            }
            async function removeSrcFiles() {
                for (const file of srcDir) {
                    await fs_1.promises.rm(`${paths_1.processProjectUrl}/src/server/entity/${file}`);
                }
            }
            await Promise.all([removeDistFiles(), removeSrcFiles()]);
            const query = await conn.manager.query(`SELECT * from sqlite_master`);
            this.logger.warn(JSON.stringify(query, null, 4), 'check');
            this.dataSource.dropDatabase();
            await queryRunner.query('PRAGMA foreign_keys = OFF');
            for (const entity of query) {
                this.logger.log(JSON.stringify(entity.name, null, 4));
                if (entity.name !== 'sqlite_sequence') {
                }
            }
            await queryRunner.query('PRAGMA foreign_keys = ON');
            return;
        }
        catch (err) {
            this.logger.error(JSON.stringify(err, null, 4));
            throw new common_1.BadRequestException(JSON.stringify(err, null, 4));
        }
    }
    async removeData() {
        const entities = this.dataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = this.dataSource.getRepository(entity.name);
            await repository.clear();
        }
    }
    async getEntityMetadata() {
        const entities = this.dataSource.entityMetadatas;
        const csvArr = [];
        const edges = [];
        const header = '"table_schema","table_name","column_name","data_type","ordinal_position"';
        csvArr.push(header);
        const schema = {
            varchar: 'character varying',
            datetime: 'timestamp without time zone',
            date: 'date',
            text: 'text',
            int: 'integer',
            json: 'json',
            primaryKey: 'bigint',
            foreignKey: 'bigint',
            boolean: 'boolean',
            specialinteger: 'numeric',
            function: 'bigint',
        };
        const data = [];
        for (const [index, entity] of entities.entries()) {
            const metadata = this.dataSource.getMetadata(entity.name);
            const columnsData = [];
            let columns = [];
            columns = metadata.columns.map((column) => column.type);
            this.logger.log(JSON.stringify(columns, null, 4));
            const columnMap = metadata.columns.map((column) => column.propertyName);
            columns.forEach((item, i) => {
                this.logger.log(columns[i]);
                const type = typeof columns[i] !== 'function' ? columns[i] : 'function';
                columnsData.push({ name: columnMap[i], type: schema[type] });
                csvArr.push(`"${'public'}","${entity.tableName}","${columnMap[i]}","${schema[type]}",${i + 1}`);
            });
            const maybeManytoManyTable = entity.tableName.split('_');
            if (maybeManytoManyTable.length >= 3) {
                edges.push({
                    source: maybeManytoManyTable[0],
                    sourceKey: 'id',
                    target: entity.tableName,
                    targetKey: `${maybeManytoManyTable[0]}Id`,
                    relation: `hasMany`,
                });
                edges.push({
                    source: maybeManytoManyTable[2],
                    sourceKey: 'id',
                    target: entity.tableName,
                    targetKey: `${maybeManytoManyTable[2]}Id`,
                    relation: `hasMany`,
                });
            }
            data.push({ name: entity.tableName, data: columnsData });
        }
        const csvString = csvArr.join('\n');
        fs_1.default.writeFileSync(`${process.cwd()}/data/schema.csv`, csvString, 'utf-8');
        await this.persistDatabaseSchema();
        const schemaPath = path_1.default.join(this.pathsService.getProcessProjectUrl(), 'src/server/config/database.schema.json');
        if (fs_1.default.existsSync(schemaPath)) {
            const data = (await fs_1.promises.readFile(schemaPath, 'utf-8')).toString();
            const parsedData = JSON.parse(data);
            const example0 = {
                type: 'OneToMany',
                table: 'customer',
            };
            const example = {
                source: 'users',
                sourceKey: 'id',
                target: 'purchases',
                targetKey: 'user_id',
                relation: 'hasMany',
            };
            parsedData.forEach((table) => {
                table.relationships.forEach((item) => {
                    return edges.push({
                        source: table.name,
                        sourceKey: 'id',
                        target: item.table,
                        targetKey: `${table.name}Id`,
                        relation: `has${item.type.split(/(?=[A-Z])/)[2]}`,
                    });
                });
            });
            return edges;
        }
    }
};
AssistantService = AssistantService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [entitygen_service_1.EntitygenService,
        paths_service_1.PathsService,
        typeorm_1.DataSource])
], AssistantService);
exports.AssistantService = AssistantService;
//# sourceMappingURL=assistant.service.js.map