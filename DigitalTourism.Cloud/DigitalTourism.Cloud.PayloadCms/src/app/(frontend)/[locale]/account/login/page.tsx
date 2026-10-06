import { Suspense } from 'react'
import LoginPageClient from './page.client'

export const dynamic = 'force-dynamic'

export default function VisitorLoginPage() {
  return (
    <div className="container py-16">
      <Suspense>
        <LoginPageClient />
      </Suspense>
    </div>
  )
}
