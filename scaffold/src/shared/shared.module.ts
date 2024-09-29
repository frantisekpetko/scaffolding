import { Module } from '@nestjs/common';
import { APP_FILTER} from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';
import { WebsocketExceptionsFilter } from './websocket-exception.filter';

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        }/*,
        {
            provide: APP_FILTER,
            useClass: WebsocketExceptionsFilter,
        }*/
    ]
})
export class SharedModule { }