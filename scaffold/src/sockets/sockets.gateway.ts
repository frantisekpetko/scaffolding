import { EntitygenService } from './../entitygen/entitygen.service';
import { InternalServerErrorException, Logger, OnModuleInit, OnApplicationBootstrap, Injectable, Inject, forwardRef } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ namespace: '/generator' })
export class SocketsGateway implements OnGatewayInit, OnGatewayConnection, OnModuleInit, OnApplicationBootstrap {
  private logger: Logger = new Logger(SocketsGateway.name);
  @WebSocketServer() static wss: Server;

  constructor(private entityGenService: EntitygenService) {}

  async onModuleInit() {
    /*
    try {
      const data = await this.entityGenService.getEntityData();
      this.logger.warn(JSON.stringify(data, null, 4), 'entities');
      //this.wss.emit('fireSendingDataForView');
      setTimeout(() => this.wss.emit('entities', data), 750);
      //this.wss.emit('entities', data)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException(error)
    }
    */
  }

  async onApplicationBootstrap() {

  }

  async afterInit(server: Server) {

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

  @SubscribeMessage('entities')
  async handleEntitiesMessage(client: any) {
    /*const data = await this.entityGenService.getEntityData();
    setTimeout(() => this.wss.emit('entities', data), 750);*/
  }

  


  @SubscribeMessage('view')
  async handleMessage(client: any, entity: string){
    /*this.logger.warn(entity, 'entity')
    const entityDataForView = await this.entityGenService.getEntityDataForView(entity);
    this.logger.warn(JSON.stringify(entityDataForView, null, 4), 'entityDataForView')
    this.wss.emit('viewdata', entityDataForView);*/
  }
}
