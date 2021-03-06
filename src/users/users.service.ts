import { BadRequestException, Injectable } from '@nestjs/common';
import { mockUsers } from '../../dataset';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { User } from './user';

@Injectable()
export class UsersService {
  private users: User[] = mockUsers;

  createUser(body: CreateUserDto): User {
    const { email, name } = body;
    const findEmail = this.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
    if (findEmail) {
      throw new BadRequestException('email already exists');
    }
    const lastUser = this.users[this.users.length - 1] || { id: 0 };
    const id = lastUser.id + 1;
    const newUser = new User(id, name, email);
    this.users.push(newUser);
    return newUser;
  }

  getUsersWithQuery(query: QueryUserDto): User[] {
    let newUsers: User[] = [...this.users];
    if (!Object.keys(query).length) return newUsers;

    Object.entries(query).forEach(([key, value]) => {
      newUsers = newUsers.filter((user) => user[key] === value);
    });
    return newUsers;
  }

  getUserById(id: number): User {
    const { user } = this.findUserAndIndex(id);
    return { ...user };
  }

  updateUserById(id: number, body: UpdateUserDto): User {
    const { index } = this.findUserAndIndex(id);
    Object.entries(body).forEach(([key, value]) => {
      this.users[index][key] = value;
    });
    return { ...this.users[index] };
  }

  deleteUserById(id: number): { userId: number; deleted: boolean } {
    const { index } = this.findUserAndIndex(id);
    this.users.splice(index, 1);
    return { userId: id, deleted: true };
  }

  getUsersByIds(ids: number[]): User[] {
    if (!ids.length) return [];
    let newUsers = [...this.users];
    newUsers = newUsers.filter((user) => ids.includes(user.id));
    return newUsers;
  }

  private findUserAndIndex = (
    userId: number,
  ): { user: User; index: number } => {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index === -1) {
      throw new BadRequestException('user does not exist');
    }
    return { user: this.users[index], index };
  };
}
