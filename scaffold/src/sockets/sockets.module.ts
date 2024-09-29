import { EntitygenModule } from './../entitygen/entitygen.module';
import { SocketsGateway } from './sockets.gateway';
import { EntitygenService } from './../entitygen/entitygen.service';
import { Module} from '@nestjs/common';

@Module({
    providers: [EntitygenService],
    exports: []
})
export class SocketsModule {}
