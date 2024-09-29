import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { root } from "./paths";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "sqlite",
    database: `${process.cwd()}/data/database.sqlite`,
    logging: true,
    autoLoadEntities: true,
    synchronize: true,
    //entities: ["src/entity/**/*.ts"],
    entities: ["dist/**/*.entity.js"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"]
}