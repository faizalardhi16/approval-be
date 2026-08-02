import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { InvoicesModule } from './invoices/invoices.module'

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, InvoicesModule],
})
export class AppModule {}