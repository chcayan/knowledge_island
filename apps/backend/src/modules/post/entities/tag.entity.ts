import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Post } from './post.entity'
import { TAG_NAME_MAX_LENGTH } from '@knowledge_island/schemas'

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, length: TAG_NAME_MAX_LENGTH })
  name!: string

  @CreateDateColumn()
  createdAt!: Date

  @ManyToMany(() => Post, (post) => post.tags)
  posts!: Post[]
}
