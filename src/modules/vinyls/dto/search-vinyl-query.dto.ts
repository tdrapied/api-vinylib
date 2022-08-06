import { IsString } from 'class-validator';

export class SearchVinylQueryDto {
  @IsString()
  barcode: string;
}
