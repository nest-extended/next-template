import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { EventsModule } from './apis/events/events.module';
import { FileUploadModule } from './apis/file-upload/file-upload.module';
import { NullResponseInterceptor } from './interceptors/null-response.interceptor';
import { VersionModule } from './apis/version/version.module';
import { UsersModule } from './apis/users/users.module';
import { AuthModule } from './apis/auth/auth.module';
import { ListenerModule } from './listeners/listeners.module';
import { FormFieldsModule } from './apis/formFields/formFields.module';
import { FormFieldSectionsModule } from './apis/formFieldSections/formFieldSections.module';
import { GetFormsModule } from './apis/getForms/getForms.module';

config();
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    AuthModule,
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    EventsModule,
    ListenerModule,
    FileUploadModule,
    UsersModule,
    VersionModule,
    FormFieldsModule,
    FormFieldSectionsModule,
    GetFormsModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: NullResponseInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
