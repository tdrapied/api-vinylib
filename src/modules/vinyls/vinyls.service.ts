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

@Injectable()
export class VinylsService {
  constructor(
    private readonly vinylRepository: VinylRepository,
    private readonly discogsApi: DiscogsApi,
    private readonly spotifyApi: SpotifyApi,
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

  async create(user: User, createVinylDto: CreateVinylDto): Promise<Vinyl> {
    // Uppercase first letter
    createVinylDto.name =
      createVinylDto.name.charAt(0).toUpperCase() +
      createVinylDto.name.slice(1);

    const vinyl: any = {
      ...createVinylDto,
      user,
    };

    // Search vinyl covers if exists
    const covers = await this.spotifyApi.getAlbumsCovers(
      createVinylDto.name,
      createVinylDto.artist,
    );
    if (covers) {
      vinyl.coverLarge = covers.large;
      vinyl.coverSmall = covers.small;
    }

    const newVinyl = await this.vinylRepository.save(vinyl);
    return new Vinyl(newVinyl);
  }

  async update(
    user: User,
    id: string,
    updateVinylDto: UpdateVinylDto,
  ): Promise<void> {
    const vinyl = await this.vinylRepository.findOneByUser(id, user);
    if (!vinyl) {
      throw new BadRequestException('Vinyl not exist');
    }

    const updatedVinyl: any = updateVinylDto;

    // If vinyl name or artist is updated, search for new covers
    if (
      updateVinylDto.name !== vinyl.name ||
      updateVinylDto.artist !== vinyl.artist
    ) {
      const covers = await this.spotifyApi.getAlbumsCovers(
        updateVinylDto.name,
        updateVinylDto.artist,
      );
      if (covers) {
        updatedVinyl.coverLarge = covers.large;
        updatedVinyl.coverSmall = covers.small;
      }
    }

    await this.vinylRepository.update(id, updatedVinyl);
  }

  async remove(user: User, id: string): Promise<void> {
    const vinyl = await this.vinylRepository.findOneByUser(id, user);
    if (!vinyl) {
      throw new BadRequestException('Vinyl not exist');
    }
    await this.vinylRepository.remove(vinyl);
  }
}
