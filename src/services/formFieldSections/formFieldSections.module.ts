import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormFieldSectionsController } from './formFieldSections.controller';
import { FormFieldSectionsService } from './formFieldSections.service';
import {
  FormFieldSections,
  FormFieldSectionsSchema,
} from 'src/schemas/formFieldSections.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FormFieldSections.name, schema: FormFieldSectionsSchema },
    ]),
  ],
  controllers: [FormFieldSectionsController],
  providers: [FormFieldSectionsService],
  exports: [FormFieldSectionsService],
})
export class FormFieldSectionsModule {}
