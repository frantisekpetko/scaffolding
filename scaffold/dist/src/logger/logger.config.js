"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonLoggerConfig = void 0;
const winston = __importStar(require("winston"));
const fs_1 = __importDefault(require("fs"));
const winston_1 = require("winston");
const pad = (n) => n.padStart(2, '0');
const formatDate = (timestamp) => `${pad(new Date(timestamp).getDate().toString())}/${pad((new Date(timestamp).getMonth() + 1).toString())}/${new Date(timestamp).getFullYear().toString()}, ` +
    `${pad(new Date(timestamp).getHours().toString())}:${pad(new Date(timestamp).getMinutes().toString())}:${pad(new Date(timestamp).getSeconds().toString())}`;
exports.winstonLoggerConfig = (0, winston_1.createLogger)({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message, context }) => {
                const logEntry = {
                    timestamp: `${formatDate(timestamp)}`,
                    level,
                    message,
                    context,
                };
                const logFilePath = 'logs/app.log';
                let logsArray = [];
                try {
                    if (fs_1.default.existsSync(logFilePath)) {
                        const existingContent = fs_1.default.readFileSync(logFilePath, 'utf8');
                        logsArray = JSON.parse(existingContent || '[]');
                    }
                }
                catch (err) {
                    console.error('Error reading log file:', err);
                }
                logsArray.push(logEntry);
                try {
                    fs_1.default.writeFileSync(logFilePath, JSON.stringify(logsArray, null, 4));
                }
                catch (err) {
                    console.error('Error writing to log file:', err);
                }
                return JSON.stringify(logEntry, null, 4);
            })),
        }),
    ],
});
//# sourceMappingURL=logger.config.js.map