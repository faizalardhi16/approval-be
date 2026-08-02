import { Injectable, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User, UserRole } from './user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } })
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } })
  }

  async create(dto: { email: string; password: string; name: string; role?: UserRole }) {
    const existing = await this.findByEmail(dto.email)
    if (existing) throw new ConflictException('Email already exists')

    const hash = await bcrypt.hash(dto.password, 10)
    const user = this.repo.create({ ...dto, password: hash })
    return this.repo.save(user)
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password)
  }

  // Seed default users
  async seed() {
    const count = await this.repo.count()
    if (count > 0) return

    await this.create({ email: 'admin@approval.dev', password: 'admin123', name: 'Admin', role: UserRole.ADMIN })
    await this.create({ email: 'approver@approval.dev', password: 'approver123', name: 'Pak Approver', role: UserRole.APPROVER })
    await this.create({ email: 'viewer@approval.dev', password: 'viewer123', name: 'Viewer User', role: UserRole.VIEWER })
    console.log('🌱 Seeded 3 users')
  }
}