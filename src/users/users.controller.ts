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
import { CreateUserDto, QueryUserDto, UserIdDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Get()
  async getUsers(@Query() query: QueryUserDto) {
    return this.usersService.getUsersWithQuery(query);
  }

  @Get(':id')
  async getUserById(@Param() param: UserIdDto) {
    return this.usersService.getUserById(param.id);
  }

  @Patch(':id')
  async updateUserById(
    @Param() param: UserIdDto,
    @Body() dto: QueryUserDto,
  ) {
    return this.usersService.updateUserById(param.id, dto);
  }

  @Delete(':id')
  async deleteUserById(@Param() param: UserIdDto) {
    return this.usersService.deleteUserById(param.id);
  }
}
