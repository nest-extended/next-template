import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({
  timestamps: true,
})
export class Users {
  _id: Types.ObjectId;

  @Prop({ type: String, trim: true, required: true })
  firstName: string;

  @Prop({ type: String, trim: true, required: true })
  lastName: string;

  @Prop({ type: String, trim: true, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: String, trim: true, required: true })
  phone: string;

  @Prop({ type: Number, enum: [1, 2, 3], default: 1 })
  role: number;

  @Prop({ type: Types.ObjectId, ref: 'Organizations', default: null })
  org?: Types.ObjectId;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
