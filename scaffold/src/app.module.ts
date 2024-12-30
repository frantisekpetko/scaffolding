import * as winston from "winston";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssistantModule } from "./assistant/assistant.module";
import { EntitygenModule } from "./entitygen/entitygen.module";
import { SharedModule } from "./shared/shared.module";

import {
	WinstonModule,
	utilities as nestWinstonModuleUtilities,
} from 'nest-winston';


@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `${process.cwd()}/.env`,
			isGlobal: true,
		}),
		AssistantModule,
		ServeStaticModule.forRoot({
			rootPath: `${process.cwd()}/frontend/${process.env.NODE_ENV === 'development' ? 'public' : 'dist'
				}`,
			exclude: ['/api*'],
		}),
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database:
				process.env.NODE_ENV === 'development'
					? `../${process.env.PROJECT_URL}${process.env.DATABASE_URL}`
					: `../${process.env.PROJECT_URL}${process.env.DATABASE_URL}`,
			logging: true,
			autoLoadEntities: true,
			synchronize: true,
			//entities: ["src/entity/**/*.ts"],
			entities: [`../${process.env.PROJECT_URL}/dist/**/*.entity.js`],
			migrations: ['src/migration/**/*.ts'],
			subscribers: ['src/subscriber/**/*.ts'],
		}),
		EntitygenModule,
		WinstonModule.forRoot({
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.ms(),
						nestWinstonModuleUtilities.format.nestLike('MyApp', {
							// options
						}),
					),
				}),
				new winston.transports.File({ filename: './errors.log' }),
				// other transports...
			],
		}),
		SharedModule,

	],
})
export class AppModule { }
