import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { Tag } from './tag.entity'

export enum PostType {
  WRITE = 0,
  ASK = 1,
}

export enum PostStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  VIOLATION = 2,
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ length: 100 })
  title!: string

  @Column({ type: 'json' })
  content!: string

  @Column({ type: 'text' })
  contentHtml!: string

  @Column({ default: 0 })
  viewCount!: number

  @Column({ default: 0 })
  likeCount!: number

  @Column({ default: 0 })
  commentCount!: number

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.WRITE,
  })
  type!: PostType

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status!: PostStatus

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  author!: User

  @ManyToMany(() => Tag, (tag) => tag.posts, {
    cascade: true,
  })
  @JoinTable()
  tags!: Tag[]
}
