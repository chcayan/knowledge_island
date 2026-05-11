import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1778506481091 implements MigrationInterface {
  name = 'Init1778506481091'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` CHANGE \`like_count\` \`collection_count\` int NOT NULL DEFAULT '0'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` CHANGE \`collection_count\` \`like_count\` int NOT NULL DEFAULT '0'`
    )
  }
}
