import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1777967685716 implements MigrationInterface {
  name = 'Init1777967685716'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD \`content_html\` text NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`content_html\``)
  }
}
