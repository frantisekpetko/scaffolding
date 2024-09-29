import { QueryRunner } from 'typeorm';
import { getConnection } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import fse from 'fs-extra';
import { root } from './config/paths';
import { promises as fsPromises } from 'fs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import path from 'path';

async function bootstrap() {
  //fse.mkdirSync(`${rootx}/entity`, { recursive: true })
  //fse.mkdirSync(`${root}/data`, { recursive: true });

  const app = await NestFactory.create(AppModule);
  //deleteTables();
  //app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const port = 5000;

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.setGlobalPrefix('/api');


  
  const logger = new Logger('main.ts');
  logger.log(`${root}/${process.env.DATABASE_URL}`);
  logger.log(process.env.DATABASE_USER);
  //logger.warn(await getAppPath())
  logger.warn(process.cwd())

  await app.listen(port, () => logger.log(`App is listening at http://localhost:${port}`));
}
bootstrap();


async function deleteTables() {
  const conn = getConnection();
  const queryRunner = conn.createQueryRunner()

  // take a connection from the connection pool
  await queryRunner.connect();
  const entities = conn.entityMetadatas;

  for (const entity of entities) {
    //const repository = conn.getRepository(entity.name); // Get repository
    //await repository.clear(); // Clear each entity table's content

    queryRunner.query(`DROP table ${entity.tableName}`)

  }

  await queryRunner.release();
}