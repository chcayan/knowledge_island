import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1780896082185 implements MigrationInterface {
  name = 'Init1780896082185'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`user_id\``)
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_8aa21186314ce53c5b61a0e8c93\``
    )
    await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`post_id\``)
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`post_id\` varchar(36) NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_8aa21186314ce53c5b61a0e8c93\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_8aa21186314ce53c5b61a0e8c93\``
    )
    await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`post_id\``)
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`post_id\` varchar(255) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_8aa21186314ce53c5b61a0e8c93\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`user_id\` varchar(255) NOT NULL`
    )
  }
}
