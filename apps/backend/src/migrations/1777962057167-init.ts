import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1777962057167 implements MigrationInterface {
  name = 'Init1777962057167'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6a9775008add570dc3e5a0bab7\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`post_tags_tag\` (\`post_id\` varchar(36) NOT NULL, \`tag_id\` int NOT NULL, INDEX \`IDX_c0a86e8a16b3aa4179f7ed919d\` (\`post_id\`), INDEX \`IDX_10eff9b79951d8c7ff3d40bbb1\` (\`tag_id\`), PRIMARY KEY (\`post_id\`, \`tag_id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD \`type\` enum ('0', '1') NOT NULL DEFAULT '0'`
    )
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD \`status\` enum ('0', '1', '2') NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`post_tags_tag\` ADD CONSTRAINT \`FK_c0a86e8a16b3aa4179f7ed919d3\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`post_tags_tag\` ADD CONSTRAINT \`FK_10eff9b79951d8c7ff3d40bbb10\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post_tags_tag\` DROP FOREIGN KEY \`FK_10eff9b79951d8c7ff3d40bbb10\``
    )
    await queryRunner.query(
      `ALTER TABLE \`post_tags_tag\` DROP FOREIGN KEY \`FK_c0a86e8a16b3aa4179f7ed919d3\``
    )
    await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`status\``)
    await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`type\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_10eff9b79951d8c7ff3d40bbb1\` ON \`post_tags_tag\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_c0a86e8a16b3aa4179f7ed919d\` ON \`post_tags_tag\``
    )
    await queryRunner.query(`DROP TABLE \`post_tags_tag\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_6a9775008add570dc3e5a0bab7\` ON \`tag\``
    )
    await queryRunner.query(`DROP TABLE \`tag\``)
  }
}
