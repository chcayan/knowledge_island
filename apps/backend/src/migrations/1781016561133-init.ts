import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1781016561133 implements MigrationInterface {
  name = 'Init1781016561133'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`dislike_count\` int NOT NULL DEFAULT '0'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP COLUMN \`dislike_count\``
    )
  }
}
