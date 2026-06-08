import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1780896892076 implements MigrationInterface {
  name = 'Init1780896892076'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP COLUMN \`updated_at\``
    )
  }
}
