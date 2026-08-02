import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email)
    if (!user || !(await this.users.validatePassword(user, password))) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role }
    return { accessToken: this.jwt.sign(payload), user: { id: user.id, email: user.email, name: user.name, role: user.role } }
  }

  async register(dto: { email: string; password: string; name: string }) {
    const user = await this.users.create({ ...dto, role: 'viewer' as any })
    return { id: user.id, email: user.email, name: user.name, role: user.role }
  }
}