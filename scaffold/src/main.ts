import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	const port = 3000;

	app.enableCors({
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	});
	app.setGlobalPrefix('/api');

	const logger = new Logger('main.ts');
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
