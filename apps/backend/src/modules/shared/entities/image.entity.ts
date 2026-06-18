import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  md5!: string

  @Column()
  url!: string

  @Column()
  size!: number

  @Column()
  mime!: string

  @CreateDateColumn()
  createdAt!: Date
}
