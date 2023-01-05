import { IsString, MaxLength } from 'class-validator';

export class SearchVinylCoverQueryDto {
  @IsString()
  @MaxLength(250)
  name: string;

  @IsString()
  @MaxLength(250)
  artist: string;
}
