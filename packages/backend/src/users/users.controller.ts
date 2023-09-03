import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth, IUser } from './interface/users.interface';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('login')
  getUsers(@Body() user: Auth) {
    return this.userService.login(user);
  }

  @Post('register')
  createUser(@Body() user: IUser) {
    return this.userService.register(user);
  }

  @Get()
  getUser(@Req() req: Request & { user: any }) {
    return this.userService.getUser(req);
  }
}
