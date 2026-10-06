'use client'

import React, { useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  AlertNotification,
  Button,
  Input,
  Label,
} from '@/components/ui'
import { createTrip } from '../actions'

type Props = {
  onTripCreated: (trip: any) => void
  variant?: 'default' | 'primary'
  user?: any
  locale: string
}

export function CreateTripModal({ onTripCreated, variant = 'default', user }: Props) {
  const t = useTranslations('tripPlanner')
  const { openAuthDialog } = useAuth()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [duration, setDuration] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorAlert, setErrorAlert] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const newTrip = await createTrip({ name, startDate, duration: Number(duration) })
      onTripCreated(newTrip)
      setOpen(false)
      setName('')
      setStartDate('')
      setDuration(1)
    } catch (error) {
      console.error('Failed to create trip', error)
      setErrorAlert({ show: true, message: t('createTripError') })
    } finally {
      setLoading(false)
    }
  }

  // Get tomorrow's date as minimum
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const handleLoginOrOpen = () => {
    openAuthDialog('login')
  }

  if (!user || user.collection !== 'visitors') {
    return variant === 'primary' ? (
      <Button
        size="lg"
        className="gap-2 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all px-6"
        onClick={handleLoginOrOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        {t('createFirstTrip')}
      </Button>
    ) : (
      <Button
        className="gap-2 rounded-xl shadow-sm hover:shadow-md transition-all"
        onClick={handleLoginOrOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        {t('createTrip')}
      </Button>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {variant === 'primary' ? (
            <Button
              size="lg"
              className="gap-2 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all px-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              {t('createFirstTrip')}
            </Button>
          ) : (
            <Button className="gap-2 rounded-xl shadow-sm hover:shadow-md transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              {t('createTrip')}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              {t('createNewTrip')}
            </DialogTitle>
            <DialogDescription>{t('createTripDesc')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {t('tripName')}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('tripNamePlaceholder')}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                  {t('startDate')}
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={minDate}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {t('duration')}
                </Label>
                <div className="relative">
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="30"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    required
                    className="h-11 rounded-xl pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {t('days', { count: duration })}
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 gap-2 rounded-xl font-semibold"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t('creating')}
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    {t('createTrip')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Error Alert Dialog */}
      <AlertNotification
        open={errorAlert.show}
        onOpenChange={(open) => setErrorAlert({ ...errorAlert, show: open })}
        title="Error"
        description={errorAlert.message}
        variant="error"
      />
    </>
  )
}
