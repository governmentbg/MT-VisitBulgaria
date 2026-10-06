'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth, useRequireAuth } from '@/providers/Auth'
import { ArrowLeft, Save, Bell, Globe, Heart } from 'lucide-react'

export default function PreferencesPageClient() {
  const { isLoading } = useRequireAuth()
  const { visitor, refreshVisitor } = useAuth()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [language, setLanguage] = useState(visitor?.language || 'en')
  const [emailNotifications, setEmailNotifications] = useState(
    visitor?.preferences?.notifications?.email ?? true
  )
  const [pushNotifications, setPushNotifications] = useState(
    visitor?.preferences?.notifications?.push ?? true
  )

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/visitors/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          language,
          preferences: {
            notifications: {
              email: emailNotifications,
              push: pushNotifications,
            },
          },
        }),
      })

      if (response.ok) {
        await refreshVisitor()
        setMessage({ type: 'success', text: 'Preferences saved successfully!' })
      } else {
        throw new Error('Failed to save preferences')
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save preferences. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <h1 className="text-3xl font-bold mb-2">Preferences</h1>
        <p className="text-muted-foreground mb-8">
          Customize your experience.
        </p>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Language */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Language</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Select your preferred language for content and notifications.
            </p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'bg' | 'de' | 'fr')}
              className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="en">English</option>
              <option value="bg">Bulgarian</option>
              <option value="de">German</option>
              <option value="fr">French</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Choose how you want to receive updates and recommendations.
            </p>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <span>Email notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <span>Push notifications</span>
              </label>
            </div>
          </div>

          {/* Interests - Placeholder */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Interests</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Select categories you&apos;re interested in to get personalized recommendations.
              This feature is coming soon!
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  )
}
