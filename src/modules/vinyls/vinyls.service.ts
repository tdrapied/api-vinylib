import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { User } from '../users/entities/user.entity';
import { VinylRepository } from './repositories/vinyl.repository';
import { Vinyl } from './entities/vinyl.entity';

@Injectable()
export class VinylsService {
  constructor(private readonly vinylRepository: VinylRepository) {}

  findAll(user: User): Promise<Vinyl[]> {
    // TODO: Add search advanced + paginate
    return this.vinylRepository.searchByUser(user);
  }

  async findOne(user: User, id: string): Promise<Vinyl> {
    const vinyl = await this.vinylRepository.findOneByUser(id, user);
    if (!vinyl) {
      throw new NotFoundException('Vinyl not found');
    }
    return vinyl;
  }

  async create(user: User, createVinylDto: CreateVinylDto): Promise<Vinyl> {
    const newVinyl = await this.vinylRepository.save({
      ...createVinylDto,
      user,
    });
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
    await this.vinylRepository.update(id, updateVinylDto);
  }

  async remove(user: User, id: string): Promise<void> {
    const vinyl = await this.vinylRepository.findOneByUser(id, user);
    if (!vinyl) {
      throw new BadRequestException('Vinyl not exist');
    }
    await this.vinylRepository.remove(vinyl);
  }
}
