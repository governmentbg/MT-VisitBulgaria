import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { toPayloadLocale } from '@/i18n/localization'
import { getSiteIdentity } from '@/utilities/getSettings'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const { tripId } = await params
  const user = await getCurrentUser()

  // Basic Auth or user ownership check
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const locale = toPayloadLocale(searchParams.get('locale') || 'en')

  const payload = await getPayload({ config: configPromise })
  const trip = await payload.findByID({
    collection: 'trips',
    id: tripId,
    depth: 1,
    locale,
    select: {
      name: true,
      visitor: true,
      startDate: true,
      duration: true,
      days: {
        dayNumber: true,
        stops: { experience: true, note: true },
      },
    },
    populate: {
      hotels: { title: true },
      restaurants: { title: true },
      activities: { title: true },
      attractions: { title: true },
      events: { title: true },
      visitors: { name: true },
    },
  })

  if (
    !trip ||
    (trip.visitor && typeof trip.visitor === 'object' && trip.visitor.id !== user.id) ||
    (typeof trip.visitor === 'string' && trip.visitor !== user.id)
  ) {
    // Allow admins?
    if (user.collection !== 'users') {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }
  
  // Load messages
  let messages: any
  try {
    // Dynamic import of JSON might require assertion or specific config depending on version
    // Using simple import assuming standard Next.js setup
    const localeModule = await import(`@/i18n/messages/${locale}.json`)
    messages = localeModule.default
  } catch (e) {
    console.error(`Failed to load messages for locale ${locale}`, e)
    const localeModule = await import(`@/i18n/messages/en.json`) 
    messages = localeModule.default
  }

  // Date Formatters
  const startDateFormatter = new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric', year: 'numeric' })
  const dayDateFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric' })

  const pdfMsgs = messages.tripPlanner.pdf
  const { siteName } = await getSiteIdentity(locale)

  // Construct DTO
  // C# Model:
  // public string Name { get; set; }
  // public DateTime StartDate { get; set; }
  // public string FormattedStartDate { get; set; }
  // public int Duration { get; set; }
  // public List<DayData> Days { get; set; }
  // public LocalizationData Localization { get; set; }

  const dto = {
    name: trip.name,
    startDate: trip.startDate,
    formattedStartDate: startDateFormatter.format(new Date(trip.startDate)),
    duration: trip.duration,
    days:
      trip.days?.map((d: any) => {
        const date = new Date(new Date(trip.startDate).setDate(new Date(trip.startDate).getDate() + (d.dayNumber - 1)))
        return {
        dayNumber: d.dayNumber,
        formattedDate: dayDateFormatter.format(date),
        stops:
          d.stops?.map((s: any) => {
            // Polymorphic relationships resolve to { relationTo, value: { id, title, ... } }
            const exp = s.experience
            const resolved = typeof exp?.value === 'object' ? exp.value : exp
            return {
              title: resolved?.title || 'Unknown',
              note: s.note || '',
              experienceId: String(resolved?.id || exp?.value || ''),
            }
          }) || [],
      }}) || [],
    localization: {
      headerTitle: pdfMsgs.headerTitle,
      daysLabel: pdfMsgs.daysLabel,
      stopsLabel: pdfMsgs.stopsLabel,
      noStopsLabel: pdfMsgs.noStopsLabel,
      footerMessage: pdfMsgs.footerMessage,
      generatedBy: (pdfMsgs.generatedBy as string).replace('{siteName}', siteName),
      page: pdfMsgs.page,
      of: pdfMsgs.of
    }
  }

  // Call C# Service
  // Try to discover the service URL from Aspire environment variables or fallback
  const apiUrl =
    process.env['services__api-service__http__0'] ||
    process.env['services__api-service__https__0'] ||
    process.env.API_SERVICE_URL ||
    'http://localhost:5082' // Default local port for C# service

  try {
    const pdfResponse = await fetch(`${apiUrl}/Itinerary/pdf?locale=${locale}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    })

    if (!pdfResponse.ok) {
      console.error('PDF Generation failed', await pdfResponse.text())
      return new NextResponse('PDF Service Error', { status: 500 })
    }

    const pdfBlob = await pdfResponse.blob()

    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Itinerary.pdf"; filename*=UTF-8''${encodeURIComponent(`Itinerary-${trip.name}.pdf`)}`,
      },
    })
  } catch (e) {
    console.error('Proxy error', e)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
