import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1780896591236 implements MigrationInterface {
  name = 'Init1780896591236'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`parent_id\``)
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP COLUMN \`reply_user_id\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`parentId\` varchar(36) NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`replyCommentId\` varchar(36) NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_e3aebe2bd1c53467a07109be596\` FOREIGN KEY (\`parentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_2d170d8272417a83f99aa90b2f8\` FOREIGN KEY (\`replyCommentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_2d170d8272417a83f99aa90b2f8\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_e3aebe2bd1c53467a07109be596\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP COLUMN \`replyCommentId\``
    )
    await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`parentId\``)
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`reply_user_id\` varchar(255) NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`parent_id\` varchar(255) NULL`
    )
  }
}
