"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const nest_winston_1 = require("nest-winston");
const app_module_1 = require("./app.module");
const logger_config_1 = require("./logger/logger.config");
async function bootstrap() {
    const logger = new common_1.Logger('main.ts');
    fs_1.default.unlink('logs/app.log', (err) => {
        if (err) {
            logger.error(err);
        }
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
        logger: nest_winston_1.WinstonModule.createLogger(logger_config_1.winstonLoggerConfig)
    });
    const port = 3000;
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('/api');
    await app.listen(port, () => logger.log(`App is listening at http://localhost:${port}`));
}
bootstrap();
//# sourceMappingURL=main.js.map