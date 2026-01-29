// form-fields.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Users } from './users.schema';
import EnsureObjectId from '@nest-extended/core/common/ensureObjectId';
import { FormFieldSections } from './formFieldSections.schema';
import { FormFieldTypesList } from 'src/apis/formFields/constants/form-fields-types';

export type FormFieldsDocument = HydratedDocument<FormFields>;

@Schema({ timestamps: true })
export class FormFields {
  @Prop({ default: 'custom', enum: ['custom', 'system'] })
  fieldType: string;

  @Prop({ required: true, trim: true, index: true })
  key: string;

  @Prop({
    default: 'user',
    enum: [
      'user',
    ],
  })
  module: string;

  @Prop({
    type: Types.ObjectId,
    ref: FormFieldSections.name,
    required: true,
    index: true,
    set: EnsureObjectId,
  })
  section: Types.ObjectId;

  @Prop({ required: true, enum: FormFieldTypesList })
  type: string;

  @Prop({ required: true, trim: true })
  label: string;

  @Prop({ trim: true })
  helpText: string;

  @Prop({ trim: true })
  placeholder: string;

  @Prop({ default: false, index: true })
  required: boolean;

  @Prop([
    {
      value: { type: String, required: true, trim: true },
      label: { type: String, trim: true },
      default: { type: Boolean, default: false },
    },
  ])
  options: {
    value: string;
    label: string;
    default: boolean;
  }[];

  @Prop({ default: 0 })
  order: number;

  @Prop()
  unique: boolean;

  @Prop()
  isSearchable: boolean;

  @Prop()
  isSortable: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: Users.name,
    default: null,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Users.name,
    default: null,
  })
  updatedBy?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Users.name,
    default: null,
  })
  deletedBy?: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: null,
    index: true,
  })
  deleted?: Boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date;
}

export const FormFieldsSchema = SchemaFactory.createForClass(FormFields);
