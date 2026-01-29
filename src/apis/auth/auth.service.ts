import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Users } from 'src/schemas/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signInLocal(email: string, pass: string): Promise<any> {
    const [user] = (await this.usersService._find({
      $paginate: false,
      email,
      $limit: 1,
      $select: [
        '_id',
        'firstName',
        'lastName',
        'userName',
        'email',
        'password',
        'createdAt',
        'updatedAt',
      ],
    })) as Users[];

    if (!user) throw new UnauthorizedException();

    const passwordValid = await bcrypt.compare(pass, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException();
    }

    const sanitizedUser = this.usersService.sanitizeUser(user);
    const payload = { sub: { id: user._id }, user };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: sanitizedUser,
    };
  }
}
