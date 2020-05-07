import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<Users> {
    return await this.usersRepository.findOne({ id });
  }

  async remove(id: number): Promise<null> {
    await this.usersRepository.delete(id);
    return;
  }

  async create(user: CreateUserDto): Promise<Users> {
    const item = new Users();
    item.username = user.username;
    item.description = user.description;
    item.age = user.age;
    item.firstName = user.firstName;
    item.lastName = user.lastName;
    return await this.usersRepository.save(item);
  }

  async update(id: number, user: CreateUserDto): Promise<Users> {
    const item = await this.usersRepository.findOne({ id });
    item.username = user.username;
    item.description = user.description;
    item.age = user.age;
    item.firstName = user.firstName;
    item.lastName = user.lastName;
    return await this.usersRepository.save(item);
  }
}
