import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users') // This defines the base route: /users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}

