import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
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

  async login(user: User): Promise<{ token: string }> {
    const payload = { email: user.email, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
