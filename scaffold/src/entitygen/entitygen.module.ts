import { PathsService } from './paths/paths.service';
import { EntitygenGateway } from './entitygen.gateway';
import { SocketsModule } from './../sockets/sockets.module';
import { Module, forwardRef } from '@nestjs/common';
import { EntitygenController } from './entitygen.controller';
import { EntitygenService } from './entitygen.service';
import { SocketsGateway } from '../sockets/sockets.gateway';
import { UtilsService } from './utils/utils.service';

@Module({
  controllers: [EntitygenController],
  providers: [EntitygenService, EntitygenGateway, PathsService, UtilsService],
  exports: [EntitygenService, EntitygenGateway],

})
export class EntitygenModule {}
