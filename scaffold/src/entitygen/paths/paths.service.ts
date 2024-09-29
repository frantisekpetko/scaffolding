import {
  Injectable,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import * as path from 'path';
import fs from 'fs';

@Injectable()
export class PathsService {
  //processProjectUrl: string = path.resolve(__dirname, `../../../../../${process.env.PROJECT_URL}`);
  //processProjectUrl: string = path.resolve(`${process.cwd()}/../${process.env.PROJECT_URL}`);
  //root: string = `${this.processProjectUrl}/dist/src`;

  private logger = new Logger(PathsService.name);

  getProcessProjectUrl(): string | null {
    let processProjectUrl: string = path.resolve(
      `${process.cwd()}/../${process.env.PROJECT_URL}`,
    );
    this.logger.warn(
      { processProjectUrl },
      fs.existsSync(processProjectUrl),
      'xxx',
    );
    if (fs.existsSync(processProjectUrl)) {
      this.logger.debug('fs.existsSync', 'xxx');
      return processProjectUrl;
    } else {
      console.warn('daadwwad');
      if (fs.existsSync('../../..')) {
        process.env.PROJECT_URL = '../../..';
        processProjectUrl = path.resolve(
          `${process.cwd()}/../${process.env.PROJECT_URL}`,
        );
        return processProjectUrl;
      } else {
        throw new ServiceUnavailableException(
          `Project path ${processProjectUrl} doesn't exist. Please check PROJECT_URL property in your .env file. Othwerwise scaffold will may not work properly!`,
          {
            cause: new Error(),
            description: `Project path ${processProjectUrl} doesn't exist. Please check PROJECT_URL property in your .env file. Othwerwise scaffold will may not work properly!`,
          },
        );
      }
    }
  }

  getRootUrl(): string | null {
    const processProjectUrl: string = path.resolve(
      `${process.cwd()}/../${process.env.PROJECT_URL}`,
    );
    const root = `${processProjectUrl}/dist/src/server`;
    if (fs.existsSync(root)) {
      return root;
    } else {
      /*
            if (fs.existsSync('../../..')) {
                process.env.PROJECT_URL = '../../..';
                processProjectUrl = path.resolve(`${process.cwd()}/../${process.env.PROJECT_URL}`);
                root = `${processProjectUrl}/dist/src`;
                return root;

            }
            */
      return null;
      /*
            throw new ServiceUnavailableException(
                `Project dist root path ${root} doesn't exist. Please check PROJECT_URL property in your .env file. Othwerwise scaffold will may not work properly!`,
                {
                    cause: new Error(), description: `Project dist root path ${root} doesn't exist. Please check PROJECT_URL property in your .env file. Othwerwise scaffold will may not work properly!`,
                }
            );
            */
    }
  }
}
