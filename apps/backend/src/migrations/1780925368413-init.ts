import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1780925368413 implements MigrationInterface {
  name = 'Init1780925368413'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`like_count\` int NOT NULL DEFAULT '0'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP COLUMN \`like_count\``
    )
  }
}
