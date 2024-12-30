import * as path from "path";
import fs from "fs";

import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';


@Injectable()
export class PathsService {
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

	return processProjectUrl;
	/*

    if (fs.existsSync(processProjectUrl)) {
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
	  */
  }

  getRootUrl(): string | null {
    const processProjectUrl: string = path.resolve(
      `${process.cwd()}/../${process.env.PROJECT_URL}`,
    );
    const root = `${processProjectUrl}/dist/src/server`;
    if (fs.existsSync(root)) {
      return root;
    } else {
    
      return null;
    }
  }
}
