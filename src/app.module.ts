import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from '../core/orm/orm.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { VinylsModule } from './modules/vinyls/vinyls.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),

    // Modules
    UsersModule,
    AuthModule,
    VinylsModule,
  ],
})
export class AppModule {}
