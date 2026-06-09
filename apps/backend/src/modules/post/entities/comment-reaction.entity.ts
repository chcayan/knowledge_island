import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { Comment } from './comment.entity'
import { CommentReactionType } from '@knowledge_island/schemas'

@Entity()
@Unique(['user', 'comment'])
export class CommentReaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user!: User

  @ManyToOne(() => Comment, {
    onDelete: 'CASCADE',
  })
  comment!: Comment

  @Column({
    type: 'enum',
    enum: CommentReactionType,
  })
  type!: CommentReactionType
}
