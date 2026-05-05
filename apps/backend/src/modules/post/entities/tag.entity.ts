import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Post } from './post.entity'

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, length: 50 })
  name!: string

  @CreateDateColumn()
  createdAt!: Date

  @ManyToMany(() => Post, (post) => post.tags)
  posts!: Post[]
}
