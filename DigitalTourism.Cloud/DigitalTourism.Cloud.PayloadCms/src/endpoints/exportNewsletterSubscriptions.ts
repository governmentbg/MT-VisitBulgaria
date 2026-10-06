import type { Endpoint, PayloadRequest } from 'payload'
import { isCuratorOrAdmin } from '@/access/accessHelpers'
import * as XLSX from 'xlsx'

export const exportNewsletterSubscriptionsEndpoint: Endpoint = {
  path: '/newsletter/export',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    if (!isCuratorOrAdmin(req.user)) {
      return Response.json(
        { errors: [{ message: 'Unauthorized — curator or admin access required' }] },
        { status: 403 },
      )
    }

    const url = new URL(req.url || '', 'http://localhost')
    const format = url.searchParams.get('format') || 'csv'

    // Fetch all subscriptions
    const { docs } = await req.payload.find({
      collection: 'newsletter-subscriptions',
      limit: 0, // all records
      sort: '-createdAt',
    })

    const rows = docs.map((doc) => ({
      Email: doc.email,
      Status: doc.status,
      Locale: doc.locale || '',
      Source: doc.source || '',
      'Subscribed At': doc.createdAt ? new Date(doc.createdAt).toISOString() : '',
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Subscriptions')

    if (format === 'xlsx') {
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      return new Response(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="newsletter-subscriptions.xlsx"',
        },
      })
    }

    // Default: CSV
    const csvContent = XLSX.utils.sheet_to_csv(worksheet)
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="newsletter-subscriptions.csv"',
      },
    })
  },
}
