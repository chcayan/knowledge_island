import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1781939021040 implements MigrationInterface {
  name = 'Init1781939021040'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` CHANGE \`content_json\` \`content_json\` json NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` CHANGE \`content_json\` \`content_json\` json NOT NULL`
    )
  }
}
