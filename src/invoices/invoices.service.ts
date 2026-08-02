import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Invoice, InvoiceStatus } from './invoice.entity'

@Injectable()
export class InvoicesService {
  constructor(@InjectRepository(Invoice) private repo: Repository<Invoice>) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(id: number) {
    const inv = await this.repo.findOne({ where: { id } })
    if (!inv) throw new NotFoundException('Invoice not found')
    return inv
  }

  create(dto: { invoiceNo: string; amount: number; vendor: string; description?: string }) {
    const inv = this.repo.create(dto)
    return this.repo.save(inv)
  }

  async approve(id: number, userName: string) {
    const inv = await this.findOne(id)
    if (inv.status !== InvoiceStatus.PENDING) {
      throw new ConflictException('Invoice already processed')
    }
    inv.status = InvoiceStatus.APPROVED
    inv.approvedBy = userName
    inv.approvedAt = new Date()
    return this.repo.save(inv)
  }

  async reject(id: number, userName: string) {
    const inv = await this.findOne(id)
    if (inv.status !== InvoiceStatus.PENDING) {
      throw new ConflictException('Invoice already processed')
    }
    inv.status = InvoiceStatus.REJECTED
    inv.approvedBy = userName
    inv.approvedAt = new Date()
    return this.repo.save(inv)
  }

  async seed() {
    const count = await this.repo.count()
    if (count > 0) return

    await this.create({ invoiceNo: 'INV-001', amount: 12_500_000, vendor: 'PT Maju Jaya', description: 'Pengadaan laptop kantor' })
    await this.create({ invoiceNo: 'INV-002', amount: 8_200_000, vendor: 'CV Teknindo', description: 'Maintenance server' })
    await this.create({ invoiceNo: 'INV-003', amount: 45_000_000, vendor: 'PT Nusantara', description: 'Konsultan IT Q4' })
    await this.create({ invoiceNo: 'INV-004', amount: 3_750_000, vendor: 'UD Sumber Rejeki', description: 'ATK bulanan' })
    console.log('🌱 Seeded 4 invoices')
  }
}