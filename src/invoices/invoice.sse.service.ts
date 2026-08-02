import { Injectable } from '@nestjs/common'
import { Response } from 'express'

interface SseClient {
  id: string
  res: Response
  invoiceId: number
}

@Injectable()
export class InvoiceSseService {
  private clients: SseClient[] = []

  addClient(invoiceId: number, res: Response): string {
    const id = `${invoiceId}-${Date.now()}-${Math.random().toString(36).slice(2)}`
    this.clients.push({ id, res, invoiceId })
    console.log(`  📡 SSE: client subscribed to invoice ${invoiceId} (total: ${this.countForInvoice(invoiceId)})`)
    return id
  }

  removeClient(clientId: string) {
    const idx = this.clients.findIndex(c => c.id === clientId)
    if (idx >= 0) {
      const c = this.clients[idx]
      this.clients.splice(idx, 1)
      console.log(`  📡 SSE: client unsubscribed from invoice ${c.invoiceId}`)
    }
  }

  broadcast(invoiceId: number, message: { event: string; data: any }) {
    let sent = 0
    for (const c of this.clients) {
      if (c.invoiceId === invoiceId) {
        this.send(c.res, message)
        sent++
      }
    }
    console.log(`  📡 Broadcasted to ${sent} clients for invoice ${invoiceId}`)
  }

  broadcastAll(message: { event: string; data: any }) {
    for (const c of this.clients) {
      this.send(c.res, message)
    }
  }

  private send(res: Response, { event, data }: { event: string; data: any }) {
    res.write(`event: ${event}
`)
    res.write(`data: ${JSON.stringify(data)}

`)
  }

  private countForInvoice(invoiceId: number): number {
    return this.clients.filter(c => c.invoiceId === invoiceId).length
  }
}