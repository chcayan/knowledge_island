import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1776518767870 implements MigrationInterface {
  name = 'Init1776518767870'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`signature\` varchar(255) NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`signature\``)
  }
}
