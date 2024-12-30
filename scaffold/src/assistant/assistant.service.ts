import fs, { promises as fsPromises } from "fs";
import path from "path";
import { DataSource } from "typeorm";
import { PathsService } from "../entitygen/paths/paths.service";
import { processProjectUrl, root } from "./../config/paths";
import { EntitygenService } from "./../entitygen/entitygen.service";

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';


@Injectable()
export class AssistantService {
  private logger: Logger = new Logger(AssistantService.name);

  constructor(
    private entitygenService: EntitygenService,
    private pathsService: PathsService,
    private dataSource: DataSource,
  ) {}

  async createAllEntities(data) {
    try {
      for (const schema of data) {
        /*
						await this.entitygenService.createEntityFile(schema);
						this.entitygenService.finishGeneratingEntityFile();
						*/
        this.logger.log(schema.name);
        Promise.all([
          this.entitygenService.createEntityFile(schema),
          this.entitygenService.finishGeneratingEntityFile(),
        ]).finally(() => {
          this.entitygenService.setChangedDataToNull();
        });


      }
      //await this.entitygenService.finishGeneratingEntityFile();
    } catch (err) {
      this.logger.error(`err ${err}`);
      //throw new BadRequestException(err)
    }
		finally {

		}
  }

  getSrcFiles(): Promise<string[]> {
    return fsPromises.readdir(`${processProjectUrl}/src/server/entity`);
  }

  async recreateDatabaseSchema() {
    //await this.persistDatabaseSchema();

    await this.removeTables();
    this.logger.warn('PATH', this.pathsService.getProcessProjectUrl());
    const schemaPath = path.join(
      this.pathsService.getProcessProjectUrl(),
      'src/server/config/databaseSchema.json',
    );

    if (fs.existsSync(schemaPath)) {
      const data = await fsPromises.readFile(schemaPath, 'utf-8');

      const parsedData = JSON.parse(data);

      function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      if (parsedData.length > 0 && Array.isArray(parsedData)) {
        this.createAllEntities(parsedData);
      }
    } else {
      throw new InternalServerErrorException(
        `Database JSON schema doesn't exists! Please persist database schema first.`,
      );
    }
  }

  async persistDatabaseSchema() {
    const entities = await this.getSrcFiles();
    //this.logger.debug(JSON.stringify(entities))
    const schemaArr: any[] = [];

    for (const entity of entities) {
      const entityName = entity.split('.')[0];
      this.logger.debug(entity, 'entity');
      const { data } = await this.entitygenService.getEntityDataForView(
        entityName,
      );
      schemaArr.push(data);
    }

    this.logger.warn(JSON.stringify(schemaArr), 'Final schema');
    await fsPromises.writeFile(
      path.join(
        this.pathsService.getProcessProjectUrl(),
        'src/server/config/database.schema.json',
      ),
      JSON.stringify(schemaArr, null, 4),
      'utf8',
    );
  }

  async removeTables() {
    const conn = this.dataSource;
    const queryRunner = conn.createQueryRunner();

    // take a connection from the connection pool
    await queryRunner.connect();

    let distDir: string[] = [];
    let srcDir: string[] = [];

    async function getDistFiles() {
      if (fs.existsSync(`${root}/entity`)) {
        distDir = await fsPromises.readdir(`${root}/entity`);
      } else {
        distDir = [];
      }
    }

    const getSrcFiles = async () => {
      srcDir = await this.getSrcFiles();
    };

    await Promise.all([getDistFiles(), getSrcFiles()]);

    try {
      await queryRunner.release();

      async function removeDistFiles() {
        for (const file of distDir) {
          await fsPromises.rm(`${root}/entity/${file}`);
        }
      }

      async function removeSrcFiles() {
        for (const file of srcDir) {
          await fsPromises.rm(`${processProjectUrl}/src/server/entity/${file}`);
        }
      }

      await Promise.all([removeDistFiles(), removeSrcFiles()]);

      //const query = await conn.manager.query(`select name from sqlite_master where type = 'table'`);

      const query = await conn.manager.query(`SELECT * from sqlite_master`);
      //const count = ifTableExists[0][Object.keys(ifTableExists[0])[0]];
      this.logger.warn(query, 'check');
      /*
	  
				  for (const entity of entities) {
					  this.logger.log(JSON.stringify(entity.name, null, 4))
					  await queryRunner.query(`DROP table ${entity.tableName}`)
				  }
				  */
      this.dataSource.dropDatabase();

      await queryRunner.query('PRAGMA foreign_keys = OFF');
      for (const entity of query) {
        this.logger.log(entity.name);
        if (entity.name !== 'sqlite_sequence') {
          //await queryRunner.query(`UNLOCK TABLE ${entity.tbl_name}`);
          //await queryRunner.query(`DROP table IF EXISTS ${entity.tbl_name}`);
          //let table = await queryRunner.getTable(entity.tbl_name);
          //await queryRunner.dropForeignKeys(entity.tbl_name, table.foreignKeys);
          //await queryRunner.dropTable(entity.tbl_name);
        }
      }
      await queryRunner.query('PRAGMA foreign_keys = ON');

      return;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException(JSON.stringify(err, null, 4));
    }
  }

  async removeData() {
    const entities = this.dataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = this.dataSource.getRepository(entity.name); // Get repository
      await repository.clear(); // Clear each entity table's content
    }
  }

  async getEntityMetadata() {
    const entities = this.dataSource.entityMetadatas;
    const csvArr: string[] = [];

    const edges: {
      source: string;
      sourceKey: string;
      target: string;
      targetKey: string;
      relation: string;
    }[] = [];

    const header =
      '"table_schema","table_name","column_name","data_type","ordinal_position"';
    csvArr.push(header);

    const schema = {
      varchar: 'character varying',
      datetime: 'timestamp without time zone',
      date: 'date',
      text: 'text',
      int: 'integer',
      json: 'json',
      primaryKey: 'bigint',
      foreignKey: 'bigint',
      boolean: 'boolean',
      specialinteger: 'numeric',
      function: 'bigint',
    };

    const data = [];

    //let columnMap = {};
    for (const [index, entity] of entities.entries()) {
      const metadata = this.dataSource.getMetadata(entity.name); // Get repository
      const columnsData = [];
      let columns = [];
      columns = metadata.columns.map((column) => column.type);
      this.logger.log(columns);
      const columnMap = metadata.columns.map((column) => column.propertyName);
      columns.forEach((item, i) => {
        this.logger.log(columns[i]);
        //let type = columns[i];
        const type = typeof columns[i] !== 'function' ? columns[i] : 'function';
        columnsData.push({ name: columnMap[i], type: schema[type] });

        csvArr.push(
          `"${'public'}","${entity.tableName}","${columnMap[i]}","${
            schema[type]
          }",${i + 1}`,
        );
      });

      const maybeManytoManyTable = entity.tableName.split('_');

      if (maybeManytoManyTable.length >= 3) {
        edges.push({
          source: maybeManytoManyTable[0],
          sourceKey: 'id',
          target: entity.tableName,
          targetKey: `${maybeManytoManyTable[0]}Id`,
          relation: `hasMany`,
        });

        edges.push({
          source: maybeManytoManyTable[2],
          sourceKey: 'id',
          target: entity.tableName,
          targetKey: `${maybeManytoManyTable[2]}Id`,
          relation: `hasMany`,
        });
      }
      //const columnMap = metadata.columns.map((column) => column.propertyName);
      //let columnMap = metadata.columns.map((column) => { name: column.propertyName, columnType: column.type });
      //columnsData.push({ name: columnMap, type: columns });
      data.push({ name: entity.tableName, data: columnsData });
    }

    const csvString = csvArr.join('\n');
    fs.writeFileSync(`${process.cwd()}/data/schema.csv`, csvString, 'utf-8');
    //return csvString;

    await this.persistDatabaseSchema();

    const schemaPath = path.join(
      this.pathsService.getProcessProjectUrl(),
      'src/server/config/database.schema.json',
    );

    if (fs.existsSync(schemaPath)) {
      const data = (await fsPromises.readFile(schemaPath, 'utf-8')).toString();

      const parsedData = JSON.parse(data);

      const example0 = {
        type: 'OneToMany',
        table: 'customer',
      };

      const example = {
        source: 'users',
        sourceKey: 'id',
        target: 'purchases',
        targetKey: 'user_id',
        relation: 'hasMany',
      };

      parsedData.forEach((table) => {
        table.relationships.forEach((item) => {
          return edges.push({
            source: table.name,
            sourceKey: 'id',
            target: item.table,
            targetKey: `${table.name}Id`,
            relation: `has${item.type.split(/(?=[A-Z])/)[2]}`,
          });
        });
      });

      return edges;
    }
  }
}
