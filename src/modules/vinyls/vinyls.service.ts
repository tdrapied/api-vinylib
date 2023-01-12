import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FilterOperator,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { User } from '../users/entities/user.entity';
import { VinylRepository } from './repositories/vinyl.repository';
import { Vinyl } from './entities/vinyl.entity';
import { SearchVinylQueryDto } from './dto/search-vinyl-query.dto';
import { DiscogsApi } from '../../utils/discogs-api';
import { DiscogsVinylModel } from './models/discogs-vinyl.model';
import { SpotifyApi } from '../../utils/spotify-api';
import { SearchVinylCoverQueryDto } from './dto/search-vinyl-cover-query.dto';
import { ImageUpload } from '../../utils/image-upload';

@Injectable()
export class VinylsService {
  constructor(
    private readonly vinylRepository: VinylRepository,
    private readonly discogsApi: DiscogsApi,
    private readonly spotifyApi: SpotifyApi,
    private readonly imageUpload: ImageUpload,
  ) {}

  async findAll(user: User, query: PaginateQuery): Promise<Paginated<Vinyl>> {
    return paginate(query, this.vinylRepository, {
      sortableColumns: ['name', 'artist', 'releaseDate', 'createdAt'],
      searchableColumns: ['name', 'artist', 'description'],
      defaultSortBy: [['name', 'ASC']],
      filterableColumns: {
        name: [FilterOperator.GTE],
        artist: [FilterOperator.GTE],
        description: [FilterOperator.GTE],
      },
      defaultLimit: 9999, // Because I'm too lazy to develop a pagination on the front.
      maxLimit: 9999,
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  async search(
    searchVinylQueryDto: SearchVinylQueryDto,
  ): Promise<DiscogsVinylModel> {
    try {
      // Get vinyls with a barcode
      const data = await this.discogsApi.getVinylsByBarcode(
        searchVinylQueryDto.barcode,
      );

      // If no result or master id
      const firstResult = data.results[0];
      if (!firstResult || !firstResult.master_id) {
        throw new Error('No results');
      }

      // Get vinyl information
      const vinyl = await this.discogsApi.getMasterById(firstResult.master_id);

      return new DiscogsVinylModel(vinyl);
    } catch (error) {
      throw new NotFoundException('Vinyl information not found');
    }
  }

  async findOne(user: User, id: string): Promise<Vinyl> {
    const vinyl = await this.vinylRepository.findOneByUser(id, user);
    if (!vinyl) {
      throw new NotFoundException('Vinyl not found');
    }
    return vinyl;
  }

  async create(
    user: User,
    createVinylDto: CreateVinylDto,
    coverFile?: Express.Multer.File,
  ): Promise<Vinyl> {
    if (createVinylDto.coverURL && coverFile) {
      throw new BadRequestException(
        'Just one cover is allowed (coverURL or coverFile)',
      );
    }

    // Uppercase first letter
    createVinylDto.name =
      createVinylDto.name.charAt(0).toUpperCase() +
      createVinylDto.name.slice(1);

    const vinyl: any = {
      ...createVinylDto,
      user,
    };

    if (coverFile) {
      // Upload cover image
      vinyl.coverFilename = await this.imageUpload.saveImage(
        coverFile,
        process.env.COVERS_UPLOAD_PATH,
      );
    }

    const newVinyl = await this.vinylRepository.save(vinyl);
    return new Vinyl(newVinyl);
  }

  async update(
    user: User,
    id: string,
    updateVinylDto: UpdateVinylDto,
    coverFile?: Express.Multer.File,
  ): Promise<void> {
    if (updateVinylDto.coverURL && coverFile) {
      throw new BadRequestException(
        'Just one cover is allowed (coverURL or coverFile)',
      );
    }

    const vinyl = await this.vinylRepository.findOneByUser(id, user);
    if (!vinyl) {
      throw new BadRequestException('Vinyl not exist');
    }

    const vinylUpdated: any = {
      coverFilename: vinyl.coverFilename,
      coverURL: vinyl.coverURL,
      ...updateVinylDto,
    };

    // Delete old cover image if new cover image is uploaded
    if (vinylUpdated.coverFilename && (vinylUpdated.coverURL || coverFile)) {
      await this.imageUpload.deleteImage(
        vinylUpdated.coverFilename,
        process.env.COVERS_UPLOAD_PATH,
      );
      vinylUpdated.coverFilename = null;
    }

    if (coverFile) {
      // Upload new cover image
      vinylUpdated.coverFilename = await this.imageUpload.saveImage(
        coverFile,
        process.env.COVERS_UPLOAD_PATH,
      );
      vinylUpdated.coverURL = null;
    }

    await this.vinylRepository.update(id, vinylUpdated);
  }

  async remove(user: User, id: string): Promise<void> {
    const vinyl = await this.vinylRepository.findOneByUser(id, user);
    if (!vinyl) {
      throw new BadRequestException('Vinyl not exist');
    }

    // Delete cover image if exist
    if (vinyl.coverFilename) {
      await this.imageUpload.deleteImage(
        vinyl.coverFilename,
        process.env.COVERS_UPLOAD_PATH,
      );
    }

    await this.vinylRepository.remove(vinyl);
  }

  async searchAlbumCoverURL(
    searchVinylCoverQuery: SearchVinylCoverQueryDto,
  ): Promise<{ url: string }> {
    const coverURL = await this.spotifyApi.getAlbumCoverURL(
      searchVinylCoverQuery.name,
      searchVinylCoverQuery.artist,
    );
    if (!coverURL) {
      throw new NotFoundException('Vinyl cover not found');
    }
    return { url: coverURL };
  }
}
