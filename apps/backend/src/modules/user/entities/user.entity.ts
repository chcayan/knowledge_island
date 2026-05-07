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
  @Column({ length: 20 })
  name!: string

  @Index({ unique: true })
  @Column()
  email!: string

  @Column({ select: false })
  password!: string

  @Column({ default: '/uploads/default/avatar.jpg' })
  avatar!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
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

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[]
}
