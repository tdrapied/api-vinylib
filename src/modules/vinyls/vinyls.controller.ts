import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseUUIDPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { VinylsService } from './vinyls.service';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { Vinyl } from './entities/vinyl.entity';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('vinyls')
@Controller('vinyls')
export class VinylsController {
  constructor(private readonly vinylsService: VinylsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  findAll(@Request() req): Promise<Vinyl[]> {
    return this.vinylsService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id')
  findOne(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Vinyl> {
    return this.vinylsService.findOne(req.user, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  create(
    @Request() req,
    @Body() createVinylDto: CreateVinylDto,
  ): Promise<Vinyl> {
    return this.vinylsService.create(req.user, createVinylDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(204)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateVinylDto: UpdateVinylDto,
  ): Promise<void> {
    return this.vinylsService.update(req.user, id, updateVinylDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiBadRequestResponse({ description: 'Bad request ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(204)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string): Promise<void> {
    return this.vinylsService.remove(req.user, id);
  }
}
