import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1780894148370 implements MigrationInterface {
  name = 'Init1780894148370'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`comment\` (\`id\` varchar(36) NOT NULL, \`post_id\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`parent_id\` varchar(255) NULL, \`reply_user_id\` varchar(255) NULL, \`content\` text NOT NULL, \`status\` enum ('0', '1', '2') NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`comment\``)
  }
}
