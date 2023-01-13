import {
  AfterLoad,
  AfterInsert,
  Column,
  Entity,
  ManyToOne,
  AfterRecover,
} from 'typeorm';
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
    nullable: true,
  })
  releaseDate: string = null;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string = null;

  // It's name of file in the storage
  @ApiHideProperty()
  @Exclude()
  @Column({
    nullable: true,
  })
  coverFilename: string = null;

  // It's the link to the cover on spotify
  @ApiHideProperty()
  @Exclude()
  @Column({
    nullable: true,
  })
  coverURL: string = null;

  cover: string = null;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  constructor(partial: Partial<Vinyl>) {
    Object.assign(this, partial);
    this.setCoverURL();
  }

  @AfterLoad()
  setCoverURL() {
    this.cover = this.coverFilename
      ? `${process.env.COVERS_URL}/${this.coverFilename}`
      : this.coverURL;
  }
}
