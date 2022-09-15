import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeReleaseDate1663253870794 implements MigrationInterface {
  name = 'changeReleaseDate1663253870794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vinyl" DROP COLUMN "releaseDate"`);
    await queryRunner.query(
      `ALTER TABLE "vinyl" ADD "releaseDate" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vinyl" DROP COLUMN "releaseDate"`);
    await queryRunner.query(`ALTER TABLE "vinyl" ADD "releaseDate" TIMESTAMP`);
  }
}
