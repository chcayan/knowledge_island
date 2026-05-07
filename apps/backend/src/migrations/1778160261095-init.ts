import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1778160261095 implements MigrationInterface {
  name = 'Init1778160261095'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` CHANGE \`status\` \`status\` enum ('0', '1', '2', '3') NOT NULL DEFAULT '0'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` CHANGE \`status\` \`status\` enum ('0', '1', '2') NOT NULL DEFAULT '0'`
    )
  }
}
