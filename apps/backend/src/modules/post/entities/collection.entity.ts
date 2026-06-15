import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { Post } from './post.entity'

@Entity()
@Unique(['user', 'post'])
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  userId!: string

  @Column()
  postId!: string

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user!: User

  @ManyToOne(() => Post, {
    onDelete: 'CASCADE',
  })
  post!: Post

  @CreateDateColumn()
  createdAt!: Date
}
