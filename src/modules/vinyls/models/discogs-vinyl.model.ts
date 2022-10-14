import { ApiProperty } from '@nestjs/swagger';

export class DiscogsVinylModel {
  @ApiProperty({ type: String, nullable: true })
  name: string = null;

  @ApiProperty({ type: String, nullable: true })
  artist: string = null;

  @ApiProperty({ type: String, nullable: true })
  releaseDate: string = null;

  constructor(data: any) {
    this.name = data.title;

    if (data.artists && data.artists.length > 0) {
      this.artist = data.artists.map((artist) => artist.name).join(', ');
    }

    this.releaseDate = data.year.toString();
  }
}
