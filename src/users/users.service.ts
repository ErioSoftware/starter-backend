import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserParams } from './dto/user.params';
import { User } from './entities/user.entity';
import { buildQuery } from './users.query-builder';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findOneByName(name: string): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.name = :name', { name: name })
      .addSelect('user.password')
      .getOne();
  }

  findAll(params: UserParams): Promise<Pagination<User>> {
    const { paginationOptions, findOptions, orderOptions } = buildQuery(params);
    return paginate<User>(this.userRepository, paginationOptions, {
      where: findOptions,
      order: orderOptions,
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user || !id)
      throw new BadRequestException('No se encontro el usuario');
    return user;
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(
      new User({ active: true, ...createUserDto }),
    );
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
