import { MigrationInterface, QueryRunner } from 'typeorm';

export class addEntities1666880458255 implements MigrationInterface {
  name = 'addEntities1666880458255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP(), \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP(), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`vinyl\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`artist\` varchar(255) NOT NULL, \`releaseDate\` varchar(255) NULL, \`description\` text NULL, \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP(), \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP(), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vinyl\` ADD CONSTRAINT \`FK_c2f7179b163a0c4155c91fc0893\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`vinyl\` DROP FOREIGN KEY \`FK_c2f7179b163a0c4155c91fc0893\``,
    );
    await queryRunner.query(`DROP TABLE \`vinyl\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
