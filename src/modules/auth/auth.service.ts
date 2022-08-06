import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/repositories/user.repository';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    // If user password is not correct
    if (!(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return new User(user);
  }

  async validateUserPayload(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub,
      },
    });
    if (!user) return null;

    return new User(user);
  }

  async login(user: User, res: Response): Promise<void> {
    const payload = { sub: user.id, email: user.email };
    await res.cookie('token', this.jwtService.sign(payload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: +process.env.COOKIE_EXPIRES_IN,
    });
  }

  logout(res: Response): void {
    res.clearCookie('token');
  }
}
