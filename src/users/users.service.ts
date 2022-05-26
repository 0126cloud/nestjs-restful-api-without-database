import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, QueryUserDto } from './dto';
import { User } from './user';

@Injectable()
export class UsersService {
  private users: User[] = [];

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
    if (!user) throw new BadRequestException('user does not exist');
    return { ...user };
  }

  updateUserById(id: number, body: QueryUserDto): User {
    const { user, index } = this.findUserAndIndex(id);
    if (!user) throw new BadRequestException('user does not exist');
    Object.entries(body).forEach(([key, value]) => {
      this.users[index][key] = value;
    });
    return { ...this.users[index] };
  }

  deleteUserById(id: number): { userId: number; deleted: boolean } {
    const { user, index } = this.findUserAndIndex(id);
    if (!user) throw new BadRequestException('user does not exist');
    this.users.splice(index, 1);
    return { userId: id, deleted: true };
  }

  private findUserAndIndex = (
    userId: number,
  ): { user: User; index: number } => {
    const index = this.users.findIndex((user) => user.id === userId);
    return { user: this.users[index], index };
  };
}
