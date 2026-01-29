import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { UsersService } from '../users/users.service';

@Controller('authentication')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('')
  signIn(@Body() signInDto: Record<string, any>) {
    if (signInDto.strategy === 'local') {
      return this.authService.signInLocal(signInDto.email, signInDto.password);
    }
    throw new BadRequestException('Invalid Strategy');
  }

  @Get('verify')
  getProfile(@Request() req) {
    return {
      user: this.usersService.sanitizeUser(req.user),
      organizationUsers: req.orgUsers,
    };
  }
}
