import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function TripsLayout({ children }: { children: React.ReactNode }) {
  const allMessages = await getMessages()

  return (
    <NextIntlClientProvider
      messages={{
        tripPlanner: allMessages.tripPlanner,
        experienceListing: allMessages.experienceListing,
      }}
    >
      {children}
    </NextIntlClientProvider>
  )
}
