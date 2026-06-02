import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  postId!: string

  @Column()
  userId!: string

  @Column({ nullable: true })
  parentId!: string

  @Column({ nullable: true })
  replyUserId!: string

  @Column('text')
  content!: string
}
