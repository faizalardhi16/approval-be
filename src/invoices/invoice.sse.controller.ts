import { Controller, Get, Param, Req, Res } from '@nestjs/common'
import { InvoiceSseService } from './invoice.sse.service'
import { InvoicesService } from './invoices.service'
import { Request, Response } from 'express'

@Controller('invoices')
export class InvoiceSseController {
  constructor(
    private sse: InvoiceSseService,
    private invoices: InvoicesService,
  ) {}

  @Get(':id/events')
  async events(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const inv = await this.invoices.findOne(+id)

    // SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    })

    // Send initial state
    res.write(`event: connected
`)
    res.write(`data: ${JSON.stringify({ id: inv.id, invoiceNo: inv.invoiceNo, status: inv.status, approvedBy: inv.approvedBy })}

`)

    // Heartbeat
    const heartbeat = setInterval(() => { res.write(': heartbeat\\n\\n') }, 15000)

    // Register
    const clientId = this.sse.addClient(+id, res)

    // Cleanup
    req.on('close', () => {
      clearInterval(heartbeat)
      this.sse.removeClient(clientId)
    })
  }
}