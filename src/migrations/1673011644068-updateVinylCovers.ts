import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateVinylCovers1673011644068 implements MigrationInterface {
  name = 'updateVinylCovers1673011644068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`vinyl\` DROP COLUMN \`coverLarge\``);
    await queryRunner.query(`ALTER TABLE \`vinyl\` DROP COLUMN \`coverSmall\``);
    await queryRunner.query(
      `ALTER TABLE \`vinyl\` ADD \`coverFilename\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vinyl\` ADD \`coverURL\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`vinyl\` DROP COLUMN \`coverURL\``);
    await queryRunner.query(
      `ALTER TABLE \`vinyl\` DROP COLUMN \`coverFilename\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vinyl\` ADD \`coverSmall\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vinyl\` ADD \`coverLarge\` varchar(255) NULL`,
    );
  }
}
