import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedModule } from "./shared/shared.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
		}),
		TypeOrmModule.forRoot(require(`${process.cwd()}/ormconfig.json`)),
		SharedModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
