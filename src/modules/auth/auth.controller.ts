import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({
    schema: { example: { email: 'string', password: 'string' } },
  })
  @ApiResponse({ status: 201, schema: { example: { token: 'string' } } })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('login')
  async login(@Request() req): Promise<{ token: string }> {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  me(@Request() req): User {
    return req.user;
  }
}
