import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1776519044028 implements MigrationInterface {
  name = 'Init1776519044028'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`id\` \`id\` int NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`)
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``)
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``)
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`id\` int NOT NULL AUTO_INCREMENT`
    )
    await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`id\`)`)
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`
    )
  }
}
