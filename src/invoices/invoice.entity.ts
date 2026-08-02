import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum InvoiceStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  invoiceNo: string

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number

  @Column()
  vendor: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING })
  status: InvoiceStatus

  @Column({ nullable: true })
  approvedBy: string

  @Column({ type: 'datetime', nullable: true })
  approvedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}