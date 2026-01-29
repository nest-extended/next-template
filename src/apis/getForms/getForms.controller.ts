import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { FormFieldSectionsService } from '../formFieldSections/formFieldSections.service';
import { FormFieldsService } from '../formFields/formFields.service';
import { FormFieldSections } from 'src/schemas/formFieldSections.schema';
import { Types } from 'mongoose';

@Controller('get-forms')
export class GetFormsController {
  constructor(
    private readonly formFieldSectionsService: FormFieldSectionsService,
    private readonly formFieldsService: FormFieldsService,
  ) {}

  @Get()
  async getForm(@Query() query: Record<string, any>) {
    const { module = 'user', organization } = query || {};

    const formFieldSections = (await this.formFieldSectionsService._find({
      organization,
      module,
      deleted: {
        $ne: true,
      },
      $paginate: false,
    })) as FormFieldSections[];

    const enrichedSections = await Promise.all(
      formFieldSections.map(async (section: FormFieldSections) => {
        const formFields = await this.formFieldsService._find({
          organization: new Types.ObjectId(organization),
          section: new Types.ObjectId(section._id as Types.ObjectId),
          $paginate: false,
        });
        return {
          // @ts-expect-error
          ...section.toObject(),
          formFields,
        };
      }),
    );

    return enrichedSections;
  }
}
