import {
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Get,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
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
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(204)
  @Post('login')
  async login(
    @Request() req,
    @Response({ passthrough: true }) res,
  ): Promise<void> {
    return this.authService.login(req.user, res);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  me(@Request() req): User {
    return req.user;
  }
}
