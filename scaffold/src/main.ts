import fs from "fs";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from "nest-winston";
import { AppModule } from "./app.module";
import { winstonLoggerConfig } from "./logger/logger.config";

async function bootstrap() {
	const logger = new Logger('main.ts');
	fs.unlink('logs/app.log', (err) => {
		if (err) {
			logger.error(err);
		}
	});
	
	const app = await NestFactory.create(AppModule, {
		cors: true,
		logger: WinstonModule.createLogger(winstonLoggerConfig)
	});
	const port = 3000;

	app.enableCors({
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	});
	app.setGlobalPrefix('/api');


	/*
	logger.log(process.env.PROJECT_URL);
	logger.debug(process.env.NODE_ENV);
	logger.warn(process.cwd());
	*/


	await app.listen(port, () =>
		logger.log(`App is listening at http://localhost:${port}`),
	);
	/*
	if (process.env.NODE_ENV === 'production') {
		app.useLogger(false);
	}
	*/
}
bootstrap();
