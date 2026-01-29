import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import { FormFields, FormFieldsDocument } from 'src/schemas/formFields.schema';

@Injectable()
export class FormFieldsService extends NestService<
  FormFields,
  FormFieldsDocument
> {
  constructor(
    @InjectModel(FormFields.name)
    private readonly formFieldsModel: Model<FormFieldsDocument>,
  ) {
    super(formFieldsModel);
  }
}
