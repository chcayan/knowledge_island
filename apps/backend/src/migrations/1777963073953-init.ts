import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1777963073953 implements MigrationInterface {
  name = 'Init1777963073953'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` CHANGE \`status\` \`status\` enum ('0', '1', '2') NOT NULL DEFAULT '0'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` CHANGE \`status\` \`status\` enum ('0', '1', '2') NULL`
    )
  }
}
