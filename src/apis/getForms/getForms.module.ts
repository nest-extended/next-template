import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GetFormsController } from './getForms.controller';
import { FormFieldSectionsModule } from '../formFieldSections/formFieldSections.module';
import { FormFieldsModule } from '../formFields/formFields.module';

@Module({
  imports: [FormFieldSectionsModule, FormFieldsModule],
  controllers: [GetFormsController],
  providers: [],
  exports: [],
})
export class GetFormsModule {}
