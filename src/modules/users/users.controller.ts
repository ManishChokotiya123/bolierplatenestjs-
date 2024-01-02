import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createpasswordhash } from 'src/helper/passwordencyption';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      createUserDto['password'] = await createpasswordhash(
        createUserDto.password,
      );
      const data = await this.usersService.create(createUserDto);
      let token = await this.authService.generateToken({
        name: createUserDto.name,
        email: createUserDto.email,
      });
      return res.status(201).send({
        success: true,
        message: 'User create successfully',
        data: { data: data, Token: token },
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findAll(@Res() res: Response) {
    try {
      const data = await this.usersService.findAll();
      return res.status(200).send({
        success: true,
        message: 'User list successfully',
        data: data,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = this.usersService.findOne(id);
      if (!data) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null,
        });
      }
      return res.status(200).send({
        success: true,
        message: 'User list successfully',
        data: data,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const checkbyId = await this.usersService.findOne(id);
      if (!checkbyId) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null,
        });
      }
      updateUserDto['password'] = await createpasswordhash(
        updateUserDto.password,
      );
      await this.usersService.update(id, updateUserDto);
      return res.status(200).send({
        success: true,
        message: 'User update successfully',
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const checkbyId = this.usersService.findOne(id);
      if (!checkbyId) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null,
        });
      }
      const data = await this.usersService.remove(id);
      return res.status(200).send({
        success: true,
        message: 'User delete successfully',
        data: null,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }
}
