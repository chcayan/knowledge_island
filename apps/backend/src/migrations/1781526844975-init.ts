import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1781526844975 implements MigrationInterface {
  name = 'Init1781526844975'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`collection\` DROP FOREIGN KEY \`FK_4f925485b013b52e32f43d430f6\``
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` DROP FOREIGN KEY \`FK_c61a5a858c5a617a9ae3eb8d24c\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_157b50fe4cf2b94ab727f4db07\` ON \`collection\``
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` DROP COLUMN \`user_id\``
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD \`user_id\` varchar(255) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` DROP COLUMN \`post_id\``
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD \`post_id\` varchar(255) NOT NULL`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_157b50fe4cf2b94ab727f4db07\` ON \`collection\` (\`user_id\`, \`post_id\`)`
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD CONSTRAINT \`FK_4f925485b013b52e32f43d430f6\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD CONSTRAINT \`FK_c61a5a858c5a617a9ae3eb8d24c\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`collection\` DROP FOREIGN KEY \`FK_c61a5a858c5a617a9ae3eb8d24c\``
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` DROP FOREIGN KEY \`FK_4f925485b013b52e32f43d430f6\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_157b50fe4cf2b94ab727f4db07\` ON \`collection\``
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` DROP COLUMN \`post_id\``
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD \`post_id\` varchar(36) NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` DROP COLUMN \`user_id\``
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD \`user_id\` varchar(36) NULL`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_157b50fe4cf2b94ab727f4db07\` ON \`collection\` (\`user_id\`, \`post_id\`)`
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD CONSTRAINT \`FK_c61a5a858c5a617a9ae3eb8d24c\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD CONSTRAINT \`FK_4f925485b013b52e32f43d430f6\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }
}
