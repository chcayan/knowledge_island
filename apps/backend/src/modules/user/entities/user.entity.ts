import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Post } from '../../post/entities/post.entity'
import { USER_NAME_MAX_LENGTH } from '@knowledge_island/schemas'
import { Comment } from '../../post/entities/comment.entity'

export enum UserSex {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ length: USER_NAME_MAX_LENGTH })
  name!: string

  @Index({ unique: true })
  @Column()
  email!: string

  @Column({ select: false })
  password!: string

  @Column({ default: '/uploads/images/default/avatar.webp' })
  avatar!: string

  @CreateDateColumn({ select: false })
  createdAt!: Date

  @UpdateDateColumn({ select: false })
  updatedAt!: Date

  @Column({ default: 0 })
  followCount!: number

  @Column({ default: 0 })
  fanCount!: number

  @Column({
    type: 'enum',
    enum: UserSex,
    default: UserSex.UNKNOWN,
  })
  sex!: UserSex

  @Column({ type: 'varchar', nullable: true })
  signature!: string | null

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  postBanUntil!: Date | null

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  commentBanUntil!: Date | null

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  loginBanUntil!: Date | null

  @Column({ default: false })
  canReviewPost!: boolean

  @Column({ default: false })
  canManageUserPermission!: boolean

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[]

  @OneToMany(() => Comment, (comment) => comment.author)
  comments!: Comment[]
}
