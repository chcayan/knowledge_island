import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1781144095741 implements MigrationInterface {
  name = 'Init1781144095741'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`replyUserId\` varchar(36) NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_c6af43fd9d035cd5c077f15c205\` FOREIGN KEY (\`replyUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_c6af43fd9d035cd5c077f15c205\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP COLUMN \`replyUserId\``
    )
  }
}
