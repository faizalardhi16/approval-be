import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { InvoicesService } from './invoices.service'
import { InvoiceSseService } from './invoice.sse.service'

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(
    private invoices: InvoicesService,
    private sse: InvoiceSseService,
  ) {}

  @Get()
  findAll() {
    return this.invoices.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoices.findOne(+id)
  }

  @Post(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('admin', 'approver')
  async approve(@Param('id') id: string, @Req() req: any) {
    const inv = await this.invoices.approve(+id, req.user.name)
    // Broadcast SSE ke semua subscriber
    this.sse.broadcast(+id, {
      event: 'status_changed',
      data: { id: inv.id, invoiceNo: inv.invoiceNo, status: inv.status, approvedBy: inv.approvedBy, approvedAt: inv.approvedAt }
    })
    return inv
  }

  @Post(':id/reject')
  @UseGuards(RolesGuard)
  @Roles('admin', 'approver')
  async reject(@Param('id') id: string, @Req() req: any) {
    const inv = await this.invoices.reject(+id, req.user.name)
    this.sse.broadcast(+id, {
      event: 'status_changed',
      data: { id: inv.id, invoiceNo: inv.invoiceNo, status: inv.status, approvedBy: inv.approvedBy, approvedAt: inv.approvedAt }
    })
    return inv
  }
}