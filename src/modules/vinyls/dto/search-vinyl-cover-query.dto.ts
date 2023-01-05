import { IsString, MaxLength } from 'class-validator';

export class SearchVinylCoverQueryDto {
  @IsString()
  name: string;

  @IsString()
  artist: string;
}
