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
import { FormFieldsService } from './formFields.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { FormFields } from 'src/schemas/formFields.schema';
import {
  ModifyBody,
  setCreatedBy,
} from '@nest-extended/core/common/decorators/ModifyBody.decorator';
import { Types } from 'mongoose';

@Controller('form-fields')
export class FormFieldsController {
  constructor(private readonly formFieldsService: FormFieldsService) {}

  @Get()
  async find(@Query() query: Record<string, any>) {
    return await this.formFieldsService._find(query);
  }

  @Get('/:id?')
  async get(@Query() query: Record<string, any>, @Param('id') id: string) {
    return await this.formFieldsService._get(id, query);
  }

  @Post()
  async create(@ModifyBody(setCreatedBy()) createFormFieldsDto: FormFields) {
    const total = await this.formFieldsService.getCount({
      fieldType: createFormFieldsDto.fieldType || 'custom',
      module: createFormFieldsDto.module || 'user',
    });

    createFormFieldsDto.key =
      createFormFieldsDto.fieldType === 'system' ? `SS${total}` : `CS${total}`;
    createFormFieldsDto.order = total;

    return await this.formFieldsService._create(createFormFieldsDto);
  }

  @Patch('/:id?')
  async patch(
    @Query() query,
    @Body() patchFormFieldsDto: Partial<FormFields>,
    @Param('id') id,
  ) {
    return await this.formFieldsService._patch(id, patchFormFieldsDto, query);
  }

  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    return await this.formFieldsService._remove(id, query, user);
  }
}
