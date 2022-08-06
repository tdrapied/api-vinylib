import { MigrationInterface, QueryRunner } from 'typeorm';

export class addVinyl1659799585042 implements MigrationInterface {
  name = 'addVinyl1659799585042';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vinyl" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "artist" character varying NOT NULL, "releaseDate" TIMESTAMP, "description" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_a35da8699c1edabf461555e8737" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl" ADD CONSTRAINT "FK_c2f7179b163a0c4155c91fc0893" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vinyl" DROP CONSTRAINT "FK_c2f7179b163a0c4155c91fc0893"`,
    );
    await queryRunner.query(`DROP TABLE "vinyl"`);
  }
}
