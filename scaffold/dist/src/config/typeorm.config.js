"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
exports.typeOrmConfig = {
    type: "sqlite",
    database: `${process.cwd()}/data/database.sqlite`,
    logging: true,
    autoLoadEntities: true,
    synchronize: true,
    entities: ["dist/**/*.entity.js"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"]
};
//# sourceMappingURL=typeorm.config.js.map