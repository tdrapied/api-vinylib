import { Module } from '@nestjs/common';
import { VinylsService } from './vinyls.service';
import { VinylsController } from './vinyls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { VinylRepository } from './repositories/vinyl.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Vinyl])],
  controllers: [VinylsController],
  providers: [VinylsService, VinylRepository],
})
export class VinylsModule {}
