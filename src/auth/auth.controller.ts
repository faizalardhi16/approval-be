import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  login(@Body() dto: { email: string; password: string }) {
    return this.auth.login(dto.email, dto.password)
  }

  @Post('register')
  register(@Body() dto: { email: string; password: string; name: string; role?: string }) {
    return this.auth.register(dto)
  }
}