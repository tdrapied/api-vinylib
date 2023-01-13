import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File): Express.Multer.File {
    if (!value) return null;

    if (value.size > +process.env.MAX_IMAGE_SIZE) {
      throw new BadRequestException('File too large');
    }

    if (
      value.mimetype !== 'image/png' &&
      value.mimetype !== 'image/jpeg' &&
      value.mimetype !== 'image/jpg'
    ) {
      throw new BadRequestException('File type not allowed');
    }

    return value;
  }
}
