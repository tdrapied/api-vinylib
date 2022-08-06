import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Vinyl {
  @Column({
    type: 'uuid',
    primary: true,
    generated: 'uuid',
  })
  id: string;

  @Column()
  name: string;

  @Column()
  artist: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  releaseDate: Date = null;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string = null;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  constructor(partial: Partial<Vinyl>) {
    Object.assign(this, partial);
  }
}
