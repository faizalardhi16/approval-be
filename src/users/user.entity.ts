import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

export enum UserRole {
  ADMIN = 'admin',
  APPROVER = 'approver',
  VIEWER = 'viewer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  name: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER })
  role: UserRole

  @CreateDateColumn()
  createdAt: Date
}