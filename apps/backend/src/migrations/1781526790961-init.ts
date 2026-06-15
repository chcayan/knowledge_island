import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1781526790961 implements MigrationInterface {
  name = 'Init1781526790961'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_157b50fe4cf2b94ab727f4db07\` ON \`collection\` (\`user_id\`, \`post_id\`)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_157b50fe4cf2b94ab727f4db07\` ON \`collection\``
    )
  }
}
