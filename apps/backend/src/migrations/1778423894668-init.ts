import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1778423894668 implements MigrationInterface {
  name = 'Init1778423894668'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`post_ban_until\` timestamp NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`comment_ban_until\` timestamp NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`login_ban_until\` timestamp NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`can_review_post\` tinyint NOT NULL DEFAULT 0`
    )
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`can_manage_user_permission\` tinyint NOT NULL DEFAULT 0`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`can_manage_user_permission\``
    )
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`can_review_post\``
    )
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`login_ban_until\``
    )
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`comment_ban_until\``
    )
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`post_ban_until\``
    )
  }
}
