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
import { ParseParamIdDto } from '../dto';
import { CreateUserDto, QueryUserDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.service.createUser(body);
  }

  @Get()
  async getUsers(@Query() query: QueryUserDto) {
    return this.service.getUsersWithQuery(query);
  }

  @Get(':id')
  async getUserById(@Param() param: ParseParamIdDto) {
    return this.service.getUserById(param.id);
  }

  @Patch(':id')
  async updateUserById(
    @Param() param: ParseParamIdDto,
    @Body() dto: QueryUserDto,
  ) {
    return this.service.updateUserById(param.id, dto);
  }

  @Delete(':id')
  async deleteUserById(@Param() param: ParseParamIdDto) {
    return this.service.deleteUserById(param.id);
  }
}
