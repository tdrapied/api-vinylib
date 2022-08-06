import { ApiProperty } from '@nestjs/swagger';

export class DiscogsVinylModel {
  @ApiProperty({ type: String, nullable: true })
  name: string = null;

  @ApiProperty({ type: String, nullable: true })
  artist: string = null;

  @ApiProperty({ type: Date, nullable: true })
  releaseDate: Date = null;

  constructor(data: any) {
    this.name = data.title;

    if (data.artists && data.artists.length > 0) {
      this.artist = data.artists.map((artist) => artist.name).join(', ');
    }

    // Convert year to date
    const date = new Date(data.year, 0);
    if (date instanceof Date && !isNaN(date.valueOf())) {
      this.releaseDate = date;
    }
  }
}
