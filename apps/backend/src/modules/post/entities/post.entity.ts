import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { Tag } from './tag.entity'
import { Comment } from './comment.entity'

export enum PostType {
  WRITE = '0',
  ASK = '1',
}

export enum PostStatus {
  DRAFT = '0',
  REVIEWING = '1',
  PUBLISHED = '2',
  VIOLATION = '3',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'json', select: false })
  content!: string

  @Column({ type: 'text' })
  contentHtml!: string

  @Column({ default: 0 })
  viewCount!: number

  @Column({ default: 0 })
  CollectionCount!: number

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

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[]
}
