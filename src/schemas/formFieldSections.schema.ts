// form-field-sections.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Users } from './users.schema';
import EnsureObjectId from '@nest-extended/core/common/ensureObjectId';

export type FormFieldSectionsDocument = HydratedDocument<FormFieldSections>;

@Schema({ timestamps: true })
export class FormFieldSections {
  _id: Types.ObjectId | FormFieldSections;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ default: 'custom', enum: ['custom', 'system'] })
  sectionType: string;

  @Prop({
    default: 'user',
    enum: ['user'],
  })
  module: string;

  @Prop({ required: true, trim: true, index: true })
  key: string;

  @Prop()
  icon: string;

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

export const FormFieldSectionsSchema =
  SchemaFactory.createForClass(FormFieldSections);
