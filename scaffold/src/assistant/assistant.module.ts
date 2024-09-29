import { PathsService } from './../entitygen/paths/paths.service';
import { SocketsGateway } from './../sockets/sockets.gateway';
import { EntitygenService } from './../entitygen/entitygen.service';
import { Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';

@Module({
  controllers: [AssistantController],
  providers: [AssistantService, EntitygenService, PathsService],
})
export class AssistantModule {}
