import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
  ParseUUIDPipe,
  HttpCode,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { VinylsService } from './vinyls.service';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { Vinyl } from './entities/vinyl.entity';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchVinylQueryDto } from './dto/search-vinyl-query.dto';
import { DiscogsVinylModel } from './models/discogs-vinyl.model';
import { PaginateQueryOptions } from '../../decorators/paginate-query-options.decorator';
import { SearchVinylCoverQueryDto } from './dto/search-vinyl-cover-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from '../../pipes/file-size-validation.pipe';

@ApiTags('vinyls')
@Controller('vinyls')
export class VinylsController {
  constructor(private readonly vinylsService: VinylsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @PaginateQueryOptions()
  @Get()
  findAll(
    @Request() req,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Vinyl>> {
    return this.vinylsService.findAll(req.user, query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({
    summary:
      'Search for information about a vinyl via a barcode in the discogs api',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get('search')
  search(
    @Query() searchVinylQueryDto: SearchVinylQueryDto,
  ): Promise<DiscogsVinylModel> {
    return this.vinylsService.search(searchVinylQueryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({
    summary:
      'Search for the URL of the cover of a vinyl if it exists in the spotify api',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get('search-cover')
  searchAlbumCoverURL(
    @Query() searchVinylCoverQuery: SearchVinylCoverQueryDto,
  ): Promise<{ url: string }> {
    return this.vinylsService.searchAlbumCoverURL(searchVinylCoverQuery);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found' })
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
  @UseInterceptors(FileInterceptor('coverFile'))
  @Post()
  create(
    @Request() req,
    @Body() createVinylDto: CreateVinylDto,
    @UploadedFile(new FileSizeValidationPipe()) coverFile?: Express.Multer.File,
  ): Promise<Vinyl> {
    return this.vinylsService.create(req.user, createVinylDto, coverFile);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseInterceptors(FileInterceptor('coverFile'))
  @HttpCode(204)
  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateVinylDto: UpdateVinylDto,
    @UploadedFile(new FileSizeValidationPipe()) coverFile?: Express.Multer.File,
  ): Promise<void> {
    return this.vinylsService.update(req.user, id, updateVinylDto, coverFile);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(204)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string): Promise<void> {
    return this.vinylsService.remove(req.user, id);
  }
}
