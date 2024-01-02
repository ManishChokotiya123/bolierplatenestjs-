import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    return await this.UserModel.create(createUserDto);
  }

  async findAll() {
    return await this.UserModel.find();
  }

  async findOne(id: string) {
    return await this.UserModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.UserModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.UserModel.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    });
  }
}
