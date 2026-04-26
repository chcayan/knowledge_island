import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1777212326000 implements MigrationInterface {
  name = 'Init1777212326000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`post\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(100) NOT NULL, \`content\` json NOT NULL, \`view_count\` int NOT NULL DEFAULT '0', \`like_count\` int NOT NULL DEFAULT '0', \`comment_count\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`author_id\` varchar(36) NULL, INDEX \`IDX_e28aa0c4114146bfb1567bfa9a\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD CONSTRAINT \`FK_2f1a9ca8908fc8168bc18437f62\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_2f1a9ca8908fc8168bc18437f62\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_e28aa0c4114146bfb1567bfa9a\` ON \`post\``
    )
    await queryRunner.query(`DROP TABLE \`post\``)
  }
}
