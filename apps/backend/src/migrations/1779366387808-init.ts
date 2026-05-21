import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1779366387808 implements MigrationInterface {
  name = 'Init1779366387808'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e28aa0c4114146bfb1567bfa9a\` ON \`post\``
    )
    await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`title\``)
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`avatar\` \`avatar\` varchar(255) NOT NULL DEFAULT '/uploads/images/default/avatar.webp'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`avatar\` \`avatar\` varchar(255) NOT NULL DEFAULT '/uploads/default/avatar.jpg'`
    )
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD \`title\` varchar(100) NOT NULL`
    )
    await queryRunner.query(
      `CREATE INDEX \`IDX_e28aa0c4114146bfb1567bfa9a\` ON \`post\` (\`title\`)`
    )
  }
}
