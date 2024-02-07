import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const newUser = new User();
    newUser.email = dto.email;
    newUser.password = dto.password;
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }
}
