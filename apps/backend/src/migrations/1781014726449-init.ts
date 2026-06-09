import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1781014726449 implements MigrationInterface {
  name = 'Init1781014726449'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`comment_reaction\` (\`id\` varchar(36) NOT NULL, \`type\` enum ('LIKE', 'DISLIKE') NOT NULL, \`user_id\` varchar(36) NULL, \`comment_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_1d6be5df3cc9d32e2bc5f0e1e5\` (\`user_id\`, \`comment_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment_reaction\` ADD CONSTRAINT \`FK_f8e54702e8418719a786c60fcd2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment_reaction\` ADD CONSTRAINT \`FK_962582f04d3f639e33f43c54bbc\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment_reaction\` DROP FOREIGN KEY \`FK_962582f04d3f639e33f43c54bbc\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comment_reaction\` DROP FOREIGN KEY \`FK_f8e54702e8418719a786c60fcd2\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_1d6be5df3cc9d32e2bc5f0e1e5\` ON \`comment_reaction\``
    )
    await queryRunner.query(`DROP TABLE \`comment_reaction\``)
  }
}
