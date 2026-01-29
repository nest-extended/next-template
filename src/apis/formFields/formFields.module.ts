import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormFieldsController } from './formFields.controller';
import { FormFieldsService } from './formFields.service';
import { FormFields, FormFieldsSchema } from 'src/schemas/formFields.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FormFields.name, schema: FormFieldsSchema },
    ]),
  ],
  controllers: [FormFieldsController],
  providers: [FormFieldsService],
  exports: [FormFieldsService],
})
export class FormFieldsModule {}
