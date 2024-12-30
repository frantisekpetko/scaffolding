import * as winston from "winston";
import Context from "../../frontend/src/context/Context";
import fs from "fs";
import { WinstonModuleOptions } from "nest-winston";
import { timestamp } from "rxjs";
import { createLogger } from "winston";

const pad = (n) => n.padStart(2, '0');

const formatDate = (timestamp) => `${pad(new Date(timestamp).getDate().toString())}/${pad(
    (new Date(timestamp).getMonth() + 1).toString()
  )}/${new Date(timestamp).getFullYear().toString()}, ` +
  `${pad(new Date(timestamp).getHours().toString())}:${pad(
    new Date(timestamp).getMinutes().toString()
  )}:${pad(new Date(timestamp).getSeconds().toString())}`

export const winstonLoggerConfig = createLogger({
	transports: [
		// Write logs to a file
		/*
		new winston.transports.File({
			filename: 'logs/app.log',
			level: 'info', // Logs all levels including 'info' and higher
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.printf(({ timestamp, level, message, context }) => {
				  // Prepare the log entry
				  const logEntry = {
					timestamp: `${formatDate(timestamp)}`,
					level,
					message,
					context,
				  };

				  // Return the log entry as a string (optional, for console output)
			
				  // Return the log entry as a string (optional, for console output)

				  return JSON.stringify(logEntry, null, 4);
				})
			),
		}),
		*/

		/*
		// Write error logs to a separate file
		new winston.transports.File({
			filename: 'logs/error.log',
			level: 'error',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.printf(({ timestamp, level, message, context }) => {
					//return `[${timestamp}] ${level}: ${message} ${context ? `(${context})` : ''}`;
					return JSON.stringify({
						timestamp: `${formatDate(timestamp)}`, level, message, context
					}, null, 4)
				}),
			),
		}),
		*/

		// Console transport for debugging in development
		new winston.transports.Console({
			level: 'debug',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.printf(({ timestamp, level, message, context }) => {
					const logEntry = {
						timestamp: `${formatDate(timestamp)}`,
						level,
						message,
						context,
					};
					const logFilePath = 'logs/app.log';
					let logsArray = [];
					try {
						if (fs.existsSync(logFilePath)) {
						const existingContent = fs.readFileSync(logFilePath, 'utf8');
						logsArray = JSON.parse(existingContent || '[]'); // Parse existing logs as an array
						}
					} catch (err) {
						console.error('Error reading log file:', err);
					}

					// Append the new log entry to the array
					logsArray.push(logEntry);

					// Write the updated array back to the file
					try {
						fs.writeFileSync(logFilePath, JSON.stringify(logsArray, null, 4));
					} catch (err) {
						console.error('Error writing to log file:', err);
					}
					//return `[${timestamp}] ${level}: ${message} ${context ? `(${context})` : ''}`;
					return JSON.stringify(logEntry, null, 4)
				}),
			),
		}),
	],
});
