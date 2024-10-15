import { EntitygenService } from './entitygen.service';
import {
  Body,
  Post,
  Get,
  Controller,
  Logger,
  Param,
  Delete,
} from '@nestjs/common';
import { Data, Column, Relationship } from './data.dto';
import { promises as fsPromises } from 'fs';
import {
  datatypes,
  getStringEntity,
  columnString,
  getFromBetween,
} from './stringmaterials';
import {
  capitalizeFirstLetter,
  getObjectBetweenParentheses,
} from 'src/utils/string.functions';
import { getConnection } from 'typeorm';

@Controller('entitygen')
export class EntitygenController {
  private logger = new Logger(EntitygenController.name);
  private isAllowedRelationshipCreating = true;

  constructor(private entityGenService: EntitygenService) {}

  @Delete('/entity/:entityName')
  async deleteEntity(@Param('entityName') entityName: string): Promise<void> {
    /*
        const conn = getConnection();
        const fileToDelete = entityName.split('.')[0];



        (fs.readdirSync(`${root}/entity`)).forEach(async (file, i) => {

            const table = file.split('.')[0];


            this.logger.warn(entityName, fs.existsSync(`./src/server/entity${entityName}`) + '');
            if (table === fileToDelete) {

                await fsPromises.unlink(`${root}/entity/${file}`)


            }

        });

        if (fs.existsSync(`${process.cwd()}/src/server/entity${entityName}`)) {
            await fsPromises.unlink(`${process.cwd()}/src/server/entity${entityName}`);
            await conn.createQueryRunner().query(`DROP TABLE '${fileToDelete}'`)
        }
        */
    return this.entityGenService.deleteEntity(entityName);
  }

  @Get('/entity/:entityName')
  async getEntityDataForView(@Param('entityName') entityName): Promise<any> {
    /*
        const getFromBetween = {
            results: [],
            string: "",
            getFromBetween: function (sub1, sub2) {
                if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
                var SP = this.string.indexOf(sub1) + sub1.length;
                var string1 = this.string.substr(0, SP);
                var string2 = this.string.substr(SP);
                var TP = string1.length + string2.indexOf(sub2);
                return this.string.substring(SP, TP);
            },
            removeFromBetween: function (sub1, sub2) {
                if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
                var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
                this.string = this.string.replace(removal, "");
            },
            getAllResults: function (sub1, sub2) {
                // first check to see if we do have both substrings
                if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

                // find one result
                var result = this.getFromBetween(sub1, sub2);
                // push it to the results array
                this.results.push(result);
                // remove the most recently found one from the string
                this.removeFromBetween(sub1, sub2);

                // if there's more substrings
                if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
                    this.getAllResults(sub1, sub2);
                }
                else return;
            },
            get: function (string, sub1, sub2) {
                this.results = [];
                this.string = string;
                this.getAllResults(sub1, sub2);
                return this.results;
            }
        };
        */

    return this.entityGenService.getEntityDataForView(entityName);
  }

  @Get()
  async getEntityData(): Promise<
    { entityName: string; filename: string; table: string }[]
  > {
    /*
        let items: { entityName: string, filename: string, table: string }[] = [];
        let checkIfDuplicateItems: string[] = [];
        (fs.readdirSync(`${root}/entity`)).forEach((file, i) => {
            const table = file.split('.')[0];
            const entityName = capitalizeFirstLetter(table);
            const fileName = `${table}.entity.ts`;

            if (checkIfDuplicateItems.indexOf(entityName) === -1) {
                items.push({ entityName: entityName, filename: fileName, table: table });
                checkIfDuplicateItems.push(entityName);
            }
        });

        return items;*/
    const items = this.entityGenService.getEntityData();
    return items;
  }

  @Post()
  async createEntityFile(@Body() data: Data): Promise<{ data: string }> {
    this.logger.log('check data [createEntityFile] controller', data);
    const dataString: { data: string } =
      await this.entityGenService.createEntityFile(data);
    this.entityGenService.setChangedDataToNull();
    this.logger.log(dataString);
    return dataString;
  }

  @Post('/finish')
  async finishGeneratingEntityFile(@Body() data: Data): Promise<void> {
    return this.entityGenService.finishGeneratingEntityFile();
  }
}
