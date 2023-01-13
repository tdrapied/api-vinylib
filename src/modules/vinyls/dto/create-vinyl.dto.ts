import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class CreateVinylDto {
  @IsString()
  @MaxLength(250)
  name: string;

  @IsString()
  @MaxLength(250)
  artist: string;

  @IsOptional()
  @IsString()
  @Matches(/^[12]\d{3}$/) // From 1000 to 2999 (year)
  releaseDate: string = null;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  description: string;

  @IsOptional()
  @MaxLength(250)
  @Matches(/^https:\/\/i\.scdn\.co\/image\/[a-zA-Z0-9]+$/)
  coverURL: string;
}
