import Link from 'next/link'
import AccountPageClient from './page.client'

export const dynamic = 'force-dynamic'

export default function AccountPage() {
  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground mb-8">
          Manage your account settings and preferences.
        </p>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <AccountPageClient />
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
