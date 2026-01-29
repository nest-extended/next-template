import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import {
  FormFieldSections,
  FormFieldSectionsDocument,
} from 'src/schemas/formFieldSections.schema';

@Injectable()
export class FormFieldSectionsService extends NestService<
  FormFieldSections,
  FormFieldSectionsDocument
> {
  constructor(
    @InjectModel(FormFieldSections.name)
    private readonly formFieldSectionsModel: Model<FormFieldSectionsDocument>,
  ) {
    super(formFieldSectionsModel);
  }
}
