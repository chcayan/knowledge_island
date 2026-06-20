import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { Post } from './post.entity'

export enum CommentStatus {
  REVIEWING = '0',
  PUBLISHED = '1',
  VIOLATION = '2',
}

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => Comment, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent!: Comment | null

  @ManyToOne(() => Comment, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'replyCommentId' })
  replyComment!: Comment | null

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'replyUserId' })
  replyUser!: User | null

  @Column({ type: 'text' })
  content!: string

  @Column({ type: 'json', select: false, nullable: true })
  contentJSON!: string

  @Column({ default: 0 })
  likeCount!: number

  @Column({ default: 0 })
  dislikeCount!: number

  @Column({
    type: 'enum',
    enum: CommentStatus,
    default: CommentStatus.REVIEWING,
  })
  status!: CommentStatus

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  author!: User

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  post!: Post
}
