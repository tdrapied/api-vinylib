import * as path from 'path';
import * as sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';

export class ImageUpload {
  async saveImage(image: Express.Multer.File, dir: string): Promise<string> {
    const filename = uuid() + '.webp';

    await sharp(image.buffer)
      .resize(300, 300, {
        position: sharp.strategy.cover,
      })
      .webp()
      .toFile(path.join(dir, filename));

    return filename;
  }

  deleteImage(filename: string, dir: string): void {
    fs.unlink(path.join(dir, filename), () => {
      // Nothing to do
    });
  }
}
