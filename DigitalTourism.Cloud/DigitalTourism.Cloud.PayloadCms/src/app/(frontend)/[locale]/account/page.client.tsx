'use client'

import Link from 'next/link'
import { useAuth, useRequireAuth } from '@/providers/Auth'
import { Settings, LogOut } from 'lucide-react'

export default function AccountPageClient() {
  const { isLoading } = useRequireAuth()
  const { visitor, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="p-6 border-b border-border">
        <div className="animate-pulse flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted"></div>
          <div>
            <div className="h-6 bg-muted rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted rounded w-48"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Profile Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-medium">
            {visitor?.name
              ? visitor.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : visitor?.email?.[0]?.toUpperCase() || 'V'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{visitor?.name || 'Visitor'}</h2>
            <p className="text-muted-foreground">{visitor?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="divide-y divide-border">
        <Link
          href="/account/preferences"
          className="flex items-center gap-4 p-4 hover:bg-muted transition-colors"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Preferences</p>
            <p className="text-sm text-muted-foreground">Language, notifications, and interests</p>
          </div>
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-4 p-4 w-full text-left hover:bg-muted transition-colors text-destructive"
        >
          <LogOut className="w-5 h-5" />
          <div>
            <p className="font-medium">Sign Out</p>
            <p className="text-sm opacity-70">Log out of your account</p>
          </div>
        </button>
      </nav>
    </>
  )
}
