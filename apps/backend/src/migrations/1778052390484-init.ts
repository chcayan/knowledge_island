import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1778052390484 implements MigrationInterface {
  name = 'Init1778052390484'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`image\` (\`id\` varchar(36) NOT NULL, \`md5\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`size\` int NOT NULL, \`mime\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4fc1a3b30b95811b02e77ae3c1\` (\`md5\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_4fc1a3b30b95811b02e77ae3c1\` ON \`image\``
    )
    await queryRunner.query(`DROP TABLE \`image\``)
  }
}
