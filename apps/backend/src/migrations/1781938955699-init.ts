import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1781938955699 implements MigrationInterface {
  name = 'Init1781938955699'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`content_json\` json NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP COLUMN \`content_json\``
    )
  }
}
