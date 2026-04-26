import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ length: 100 })
  title!: string

  @Column({ type: 'json' })
  content!: string

  @Column({ default: 0 })
  viewCount!: number

  @Column({ default: 0 })
  likeCount!: number

  @Column({ default: 0 })
  commentCount!: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  author!: User
}
