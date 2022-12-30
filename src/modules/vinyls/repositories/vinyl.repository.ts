import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Vinyl } from '../entities/vinyl.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class VinylRepository extends Repository<Vinyl> {
  constructor(private dataSource: DataSource) {
    super(Vinyl, dataSource.createEntityManager());
  }

  findOneByUser(id: string, user: User): Promise<Vinyl> {
    return this.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
      relations: ['user'],
    });
  }
}
