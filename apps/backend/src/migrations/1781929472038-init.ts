import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1781929472038 implements MigrationInterface {
  name = 'Init1781929472038'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`comment\` (\`id\` varchar(36) NOT NULL, \`content\` text NOT NULL, \`like_count\` int NOT NULL DEFAULT '0', \`dislike_count\` int NOT NULL DEFAULT '0', \`status\` enum ('0', '1', '2') NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`parentId\` varchar(36) NULL, \`replyCommentId\` varchar(36) NULL, \`replyUserId\` varchar(36) NULL, \`author_id\` varchar(36) NULL, \`post_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`collection\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`post_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_157b50fe4cf2b94ab727f4db07\` (\`user_id\`, \`post_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(20) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL DEFAULT '/uploads/images/default/avatar.webp', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`follow_count\` int NOT NULL DEFAULT '0', \`fan_count\` int NOT NULL DEFAULT '0', \`sex\` enum ('0', '1', '2') NOT NULL DEFAULT '0', \`signature\` varchar(255) NULL, \`post_ban_until\` timestamp NULL, \`comment_ban_until\` timestamp NULL, \`login_ban_until\` timestamp NULL, \`can_review_post\` tinyint NOT NULL DEFAULT 0, \`can_manage_user_permission\` tinyint NOT NULL DEFAULT 0, INDEX \`IDX_065d4d8f3b5adb4a08841eae3c\` (\`name\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`post\` (\`id\` varchar(36) NOT NULL, \`content\` json NOT NULL, \`content_html\` text NOT NULL, \`view_count\` int NOT NULL DEFAULT '0', \`collection_count\` int NOT NULL DEFAULT '0', \`comment_count\` int NOT NULL DEFAULT '0', \`type\` enum ('0', '1') NOT NULL DEFAULT '0', \`status\` enum ('0', '1', '2', '3') NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`author_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6a9775008add570dc3e5a0bab7\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`image\` (\`id\` varchar(36) NOT NULL, \`md5\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`size\` int NOT NULL, \`mime\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4fc1a3b30b95811b02e77ae3c1\` (\`md5\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`comment_reaction\` (\`id\` varchar(36) NOT NULL, \`type\` enum ('LIKE', 'DISLIKE') NOT NULL, \`user_id\` varchar(36) NULL, \`comment_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_1d6be5df3cc9d32e2bc5f0e1e5\` (\`user_id\`, \`comment_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`post_tags_tag\` (\`post_id\` varchar(36) NOT NULL, \`tag_id\` int NOT NULL, INDEX \`IDX_c0a86e8a16b3aa4179f7ed919d\` (\`post_id\`), INDEX \`IDX_10eff9b79951d8c7ff3d40bbb1\` (\`tag_id\`), PRIMARY KEY (\`post_id\`, \`tag_id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_e3aebe2bd1c53467a07109be596\` FOREIGN KEY (\`parentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_2d170d8272417a83f99aa90b2f8\` FOREIGN KEY (\`replyCommentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_c6af43fd9d035cd5c077f15c205\` FOREIGN KEY (\`replyUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_3ce66469b26697baa097f8da923\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_8aa21186314ce53c5b61a0e8c93\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD CONSTRAINT \`FK_4f925485b013b52e32f43d430f6\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD CONSTRAINT \`FK_c61a5a858c5a617a9ae3eb8d24c\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD CONSTRAINT \`FK_2f1a9ca8908fc8168bc18437f62\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment_reaction\` ADD CONSTRAINT \`FK_f8e54702e8418719a786c60fcd2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`comment_reaction\` ADD CONSTRAINT \`FK_962582f04d3f639e33f43c54bbc\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`post_tags_tag\` ADD CONSTRAINT \`FK_c0a86e8a16b3aa4179f7ed919d3\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`post_tags_tag\` ADD CONSTRAINT \`FK_10eff9b79951d8c7ff3d40bbb10\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post_tags_tag\` DROP FOREIGN KEY \`FK_10eff9b79951d8c7ff3d40bbb10\``
    )
    await queryRunner.query(
      `ALTER TABLE \`post_tags_tag\` DROP FOREIGN KEY \`FK_c0a86e8a16b3aa4179f7ed919d3\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comment_reaction\` DROP FOREIGN KEY \`FK_962582f04d3f639e33f43c54bbc\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comment_reaction\` DROP FOREIGN KEY \`FK_f8e54702e8418719a786c60fcd2\``
    )
    await queryRunner.query(
      `ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_2f1a9ca8908fc8168bc18437f62\``
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` DROP FOREIGN KEY \`FK_c61a5a858c5a617a9ae3eb8d24c\``
    )
    await queryRunner.query(
      `ALTER TABLE \`collection\` DROP FOREIGN KEY \`FK_4f925485b013b52e32f43d430f6\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_8aa21186314ce53c5b61a0e8c93\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_3ce66469b26697baa097f8da923\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_c6af43fd9d035cd5c077f15c205\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_2d170d8272417a83f99aa90b2f8\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_e3aebe2bd1c53467a07109be596\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_10eff9b79951d8c7ff3d40bbb1\` ON \`post_tags_tag\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_c0a86e8a16b3aa4179f7ed919d\` ON \`post_tags_tag\``
    )
    await queryRunner.query(`DROP TABLE \`post_tags_tag\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_1d6be5df3cc9d32e2bc5f0e1e5\` ON \`comment_reaction\``
    )
    await queryRunner.query(`DROP TABLE \`comment_reaction\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_4fc1a3b30b95811b02e77ae3c1\` ON \`image\``
    )
    await queryRunner.query(`DROP TABLE \`image\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_6a9775008add570dc3e5a0bab7\` ON \`tag\``
    )
    await queryRunner.query(`DROP TABLE \`tag\``)
    await queryRunner.query(`DROP TABLE \`post\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_065d4d8f3b5adb4a08841eae3c\` ON \`user\``
    )
    await queryRunner.query(`DROP TABLE \`user\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_157b50fe4cf2b94ab727f4db07\` ON \`collection\``
    )
    await queryRunner.query(`DROP TABLE \`collection\``)
    await queryRunner.query(`DROP TABLE \`comment\``)
  }
}
