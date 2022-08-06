import { IsOptional, IsString, MaxLength, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVinylDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(50)
  artist: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  releaseDate: Date = null;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  description: string = null;
}
