import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FormFieldSectionsService } from './formFieldSections.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { FormFieldSections } from 'src/schemas/formFieldSections.schema';
import {
  ModifyBody,
  setCreatedBy,
} from '@nest-extended/core/common/decorators/ModifyBody.decorator';
import { Types } from 'mongoose';

@Controller('form-field-sections')
export class FormFieldSectionsController {
  constructor(
    private readonly formFieldSectionsService: FormFieldSectionsService,
  ) {}

  @Get()
  async find(@Query() query: Record<string, any>) {
    return await this.formFieldSectionsService._find(query);
  }

  @Get('/:id?')
  async get(@Query() query: Record<string, any>, @Param('id') id: string) {
    return await this.formFieldSectionsService._get(id, query);
  }

  @Post()
  async create(
    @ModifyBody(setCreatedBy()) createFormFieldSectionsDto: Record<string, any>,
  ) {
    const total = await this.formFieldSectionsService.getCount({
      organization: new Types.ObjectId(createFormFieldSectionsDto.organization),
      sectionType: createFormFieldSectionsDto.fieldType || 'custom',
      module: createFormFieldSectionsDto.module || 'user',
    });

    createFormFieldSectionsDto.key =
      createFormFieldSectionsDto.fieldType === 'system'
        ? `SS${total}`
        : `CS${total}`;
    createFormFieldSectionsDto.order = total;

    return await this.formFieldSectionsService._create(
      createFormFieldSectionsDto,
    );
  }

  @Patch('/:id?')
  async patch(
    @Query() query,
    @Body() patchFormFieldSectionsDto: Partial<FormFieldSections>,
    @Param('id') id,
  ) {
    return await this.formFieldSectionsService._patch(
      id,
      patchFormFieldSectionsDto,
      query,
    );
  }

  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    return await this.formFieldSectionsService._remove(id, query, user);
  }
}
