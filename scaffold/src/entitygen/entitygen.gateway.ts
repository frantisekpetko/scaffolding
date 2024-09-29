import { EntitygenService } from './entitygen.service';
import { Data, Relationship } from './data.dto';
import {
  InternalServerErrorException,
  Logger,
  OnModuleInit,
  OnApplicationBootstrap,
  Injectable,
  HttpException,
  HttpStatus,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import { WebsocketExceptionsFilter } from '../shared/websocket-exception.filter';
import { cli } from 'winston/lib/winston/config';
import chokidar from 'chokidar';
import { PathsService } from './paths/paths.service';
import { TypeOrmDataSourceFactory } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@WebSocketGateway({ namespace: '/generator', cors: true })
@UseFilters(new WebsocketExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@Injectable()
export class EntitygenGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnModuleInit,
    OnApplicationBootstrap
{
  private logger: Logger = new Logger(EntitygenGateway.name);
  @WebSocketServer() wss: Server;

  timer: NodeJS.Timeout | string | number | undefined = null;

  constructor(
    private entityGenService: EntitygenService,
    private pathsService: PathsService,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    //this.wss.emit('fireSendingDataForView');
    this.logger.log(
      `${this.pathsService.getProcessProjectUrl()}/src/server/entity`,
    );
    /*
        const watcher = chokidar.watch(`${this.pathsService.getProcessProjectUrl()}/src/entity`, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true
        });

        watcher
            .on('add', async (path) => {
                this.sendDataWhenFilesHaveChanged();
                this.logger.log('watcher')
            })
            .on('change', async (path) => {
                this.sendDataWhenFilesHaveChanged();
                this.logger.log('watcher')
            })
            .on('unlink', async (path) => {
                this.sendDataWhenFilesHaveChanged();
                this.logger.log('watcher')
            })
            .on('error', error => this.logger.error(`Watcher error: ${error}`));
        */
    try {
      //const data = await this.entityGenService.getEntityData();
      //this.logger.warn(JSON.stringify(data, null, 4), 'entities');
      //this.wss.emit('entities', data)
      //setTimeout(() => this.wss.emit('entities', data), 750);
      //this.wss.emit('entities', data)
    } catch (error) {
      this.logger.error(error);

      /*
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error,
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: new Error(error)
            });
            */
      //throw new InternalServerErrorException(error)
    }
  }

  async onApplicationBootstrap() {
    /*
        try {
          const data = await this.entityGenService.getEntityData();
          this.logger.warn(JSON.stringify(data, null, 4), 'entities');
          //
          setTimeout(() => this.wss.emit('entities', data), 750);
          //this.wss.emit('entities', data)
        } catch (error) {
          this.logger.error(error)
          throw new InternalServerErrorException(error)
        }
        */
  }

  async afterInit(server: Server) {
    const watcher = chokidar.watch(
      `${this.pathsService.getProcessProjectUrl()}/src/server/entity`,
      {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
      },
    );

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
            id: (server as any).id,
            //rid: data.rid,
            ...(error instanceof Object ? { ...error } : { message: error }),
          },
        });
      });
  }

  async handleConnection(client: Socket, ...args: any[]) {
    /*
        try {
          const data = await this.entityGenService.getEntityData();
          this.logger.warn(JSON.stringify(data, null, 4), 'entities');
    
          setTimeout(() => this.wss.emit('entities', data), 750);
        } catch (error) {
          this.logger.error(error)
          throw new InternalServerErrorException(error)
        }
        this.logger.log('Initialized!');
        */
  }

  async sendDataWhenFilesHaveChanged() {
    //debounce
    this.logger.log('sendDataWhenFilesHaveChanged');
    clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      try {
        const data = await this.entityGenService.getEntityData();
        this.wss.emit('entities', data);
        //throw new Error('some error')
        //this.wss.emit('fireSendingDataForView');
        this.logger.log('Sended');
      } catch (error) {
        this.logger.error(error);
        //throw new WsException(e);
        this.wss.emit('error', {
          event: 'error',
          data: {
            id: (this.wss as any).id,
            //rid: data.rid,
            ...(error instanceof Object ? { ...error } : { message: error }),
          },
        });
      }
    }, 1000);
  }

  @SubscribeMessage('entities')
  async handleEntitiesMessage(client: Socket) {
    const data = await this.entityGenService.getEntityData();
    this.logger.log('entities', JSON.stringify(data, null, 4));

    //throw new WsException('some error')
    //client.emit('entities', data);
    //client.send(JSON.stringify(data))

    this.wss.emit('entities', data);
  }

  @SubscribeMessage('view')
  async handleMessage(client: any, entity: string) {
    this.logger.warn("@SubscribeMessage('view')");
    this.logger.warn(entity, 'entity');
    const entityDataForView = await this.entityGenService.getEntityDataForView(
      entity,
    );
    this.logger.warn(
      JSON.stringify(entityDataForView, null, 4),
      'entityDataForView',
    );
    this.wss.emit('viewdata', entityDataForView);
  }

  @SubscribeMessage('delete')
  async deleteEntity(client: any, entityName: string): Promise<void> {
    this.entityGenService.deleteEntity(entityName);
    const table = entityName.split('.')[0];
    const conn = this.dataSource;
    const queryRunner = conn.createQueryRunner();
    const query = await conn.manager.query(`SELECT * from sqlite_master`);

    for (const entity of query) {
      const data: Data = (
        await this.entityGenService.getEntityDataForView(entity.tbl_name)
      ).data;
      const rel = data.relationships.filter((item: Relationship) => {
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
}
