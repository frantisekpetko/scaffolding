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
var EntitygenGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitygenGateway = void 0;
const entitygen_service_1 = require("./entitygen.service");
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const websocket_exception_filter_1 = require("../shared/websocket-exception.filter");
const chokidar_1 = __importDefault(require("chokidar"));
const paths_service_1 = require("./paths/paths.service");
const typeorm_1 = require("typeorm");
let EntitygenGateway = EntitygenGateway_1 = class EntitygenGateway {
    constructor(entityGenService, pathsService, dataSource) {
        this.entityGenService = entityGenService;
        this.pathsService = pathsService;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(EntitygenGateway_1.name);
        this.timer = null;
    }
    async onModuleInit() {
        this.logger.log(`${this.pathsService.getProcessProjectUrl()}/src/server/entity`);
        try {
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    async onApplicationBootstrap() {
    }
    async afterInit(server) {
        const watcher = chokidar_1.default.watch(`${this.pathsService.getProcessProjectUrl()}/src/server/entity`, {
            ignored: /(^|[\/\\])\../,
            persistent: true,
        });
        watcher
            .on('add', async (path) => {
            this.sendDataWhenFilesHaveChanged();
            this.logger.log('watcher');
        })
            .on('change', async (path) => {
            this.sendDataWhenFilesHaveChanged();
            this.logger.log('watcher');
        })
            .on('unlink', async (path) => {
            this.sendDataWhenFilesHaveChanged();
            this.logger.log('watcher');
        })
            .on('error', (error) => {
            this.logger.error(`Watcher error: ${error}`);
            server.emit('error', {
                event: 'error',
                data: {
                    id: server.id,
                    ...(error instanceof Object ? { ...error } : { message: error }),
                },
            });
        });
    }
    async handleConnection(client, ...args) {
    }
    async sendDataWhenFilesHaveChanged() {
        this.logger.log('sendDataWhenFilesHaveChanged');
        clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
            try {
                const data = await this.entityGenService.getEntityData();
                this.wss.emit('entities', data);
                this.logger.log('Sended');
            }
            catch (error) {
                this.logger.error(error);
                this.wss.emit('error', {
                    event: 'error',
                    data: {
                        id: this.wss.id,
                        ...(error instanceof Object ? { ...error } : { message: error }),
                    },
                });
            }
        }, 1000);
    }
    async handleEntitiesMessage(client) {
        const data = await this.entityGenService.getEntityData();
        this.logger.log('entities', JSON.stringify(data, null, 4));
        this.wss.emit('entities', data);
    }
    async handleMessage(client, entity) {
        this.logger.warn("@SubscribeMessage('view')");
        this.logger.warn(entity, 'entity');
        const entityDataForView = await this.entityGenService.getEntityDataForView(entity);
        this.logger.warn(JSON.stringify(entityDataForView, null, 4), 'entityDataForView');
        this.wss.emit('viewdata', entityDataForView);
    }
    async deleteEntity(client, entityName) {
        this.entityGenService.deleteEntity(entityName);
        const table = entityName.split('.')[0];
        const conn = this.dataSource;
        const queryRunner = conn.createQueryRunner();
        const query = await conn.manager.query(`SELECT * from sqlite_master`);
        for (const entity of query) {
            const data = (await this.entityGenService.getEntityDataForView(entity.tbl_name)).data;
            const rel = data.relationships.filter((item) => {
                return item.table !== table;
            });
            if (data.relationships.length > rel.length) {
                const tempData = { ...data };
                tempData.relationships = [...rel];
                await Promise.all([
                    this.entityGenService.createEntityFile(tempData),
                    this.entityGenService.finishGeneratingEntityFile(),
                ]);
                const qRTable = await queryRunner.getTable(table);
                await queryRunner.dropForeignKeys(table, qRTable.foreignKeys);
                await queryRunner.dropTable(table);
            }
        }
        const data = await this.entityGenService.getEntityData();
        this.logger.warn(JSON.stringify(data, null, 4), 'entities');
        this.wss.emit('entities', data);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EntitygenGateway.prototype, "wss", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('entities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EntitygenGateway.prototype, "handleEntitiesMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EntitygenGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('delete'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EntitygenGateway.prototype, "deleteEntity", null);
EntitygenGateway = EntitygenGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: '/generator', cors: true }),
    (0, common_1.UseFilters)(new websocket_exception_filter_1.WebsocketExceptionsFilter()),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [entitygen_service_1.EntitygenService,
        paths_service_1.PathsService,
        typeorm_1.DataSource])
], EntitygenGateway);
exports.EntitygenGateway = EntitygenGateway;
//# sourceMappingURL=entitygen.gateway.js.map