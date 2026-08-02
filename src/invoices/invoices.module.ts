import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Invoice } from './invoice.entity'
import { InvoicesService } from './invoices.service'
import { InvoiceSseService } from './invoice.sse.service'
import { InvoicesController } from './invoices.controller'
import { InvoiceSseController } from './invoice.sse.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  providers: [InvoicesService, InvoiceSseService],
  controllers: [InvoicesController, InvoiceSseController],
  exports: [InvoicesService],
})
export class InvoicesModule {}