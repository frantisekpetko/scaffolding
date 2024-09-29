import { ConfigModule } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as path from 'path';

const logger = new Logger('paths.ts');

export const processProjectUrl: string = path.resolve(
  process.cwd(),
  '../../..',
);
export const root = `${processProjectUrl}/dist/src/server`;
