import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssistantService } from './assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('schema/recreate')
  recreateDatabaseSchema() {
    return this.assistantService.recreateDatabaseSchema();
  }

  @Post('schema/persist')
  persistDatabaseSchema() {
    return this.assistantService.persistDatabaseSchema();
  }

  @Post('tables')
  removeTables() {
    return this.assistantService.removeTables();
  }

  @Post('data')
  removeData() {
    return this.assistantService.removeData();
  }

  @Get()
  getEntityMetadata() {
    return this.assistantService.getEntityMetadata();
  }
}
