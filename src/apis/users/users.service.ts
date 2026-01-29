import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import { Users, UsersDocument } from 'src/schemas/users.schema';

@Injectable()
export class UsersService extends NestService<Users, UsersDocument> {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<UsersDocument>,
  ) {
    console.log(Users.name);
    super(usersModel);
  }

  sanitizeUser(user: Users) {
    // @ts-expect-error can be error
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }
}
