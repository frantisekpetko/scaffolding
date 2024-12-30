import * as path from "path";
import { Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

const logger = new Logger('paths.ts');

export const processProjectUrl: string = path.resolve(
	process.cwd(),
	'../../..',
);
export const root = `${processProjectUrl}/dist/src/server`;
