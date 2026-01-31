import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { config } from 'dotenv';
import { EventsModule } from './services/events/events.module';
import { FileUploadModule } from './services/file-upload/file-upload.module';
import { NullResponseInterceptor } from './interceptors/null-response.interceptor';
import { VersionModule } from './services/version/version.module';
import { UsersModule } from './services/users/users.module';
import { AuthModule } from './services/auth/auth.module';
import { ListenerModule } from './listeners/listeners.module';
import { FormFieldsModule } from './services/formFields/formFields.module';
import { FormFieldSectionsModule } from './services/formFieldSections/formFieldSections.module';
import { GetFormsModule } from './services/getForms/getForms.module';
import { NestExtendedModule } from '@nest-extended/core/lib/nest-extended.module';

config();
@Module({
  imports: [
    NestExtendedModule.forRoot({
      softDelete: {
        getQuery: () => ({ deleted: { $ne: true } }),
        getData: (user) => ({
          deleted: true,
          deletedBy: user?._id,
          deletedAt: new Date(),
        }),
      },
      // Optional: Override ClsModule config (defaults: { global: true, middleware: { mount: true } })
      // clsModule: { global: true, middleware: { mount: true } },
      // Optional: Override ConfigModule config (defaults: { envFilePath: ['.env'], isGlobal: true })
      // config: { envFilePath: ['.env'], isGlobal: true },
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
export class AppModule { }
