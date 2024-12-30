import fs from "fs";
import { log } from "console";
import { Logger } from "frontend/src/utils/logger";
import { AssistantService } from "./assistant.service";

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';


@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('logs')
  getLogFile() {
	let logsString = JSON.parse(fs.readFileSync('logs/app.log', 'utf8'));
	return logsString;
	//return logsStringArray.join('}');
  }

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
