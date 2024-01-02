import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { AuthTokenDto } from './dto/auth-token.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<User>,
    private jwtService: JwtService,
  ) {}

  async generateToken(payload: AuthTokenDto) {
    return await this.jwtService.signAsync(payload);
  }

  //   async generateMetaMaskToken(payload: MetaMaskAuthTokenDto) {
  //     return await this.jwtService.signAsync(payload);
  //   }

  async getUserBasedOnToken(payload: any) {
    let where = {};
    if (payload.walletAddress) {
      where['walletAddress'] = payload.walletAddress;
    }
    if (payload.email) {
      where['email'] = payload.email;
    }
    return this.userRepository.findOne(where);
  }
  //     return await this.userRepository.({
  //       where,
  //       attributes: { exclude: ['password'] },
  //     });
  //   }

  //   async generateResetPasswordToken() {
  //     return await this.jwtService.signAsync("secret" , { expiresIn });
  //   }

  async verifyResetPasswordToken(token: string) {
    return await this.jwtService.verify(token);
  }
}
