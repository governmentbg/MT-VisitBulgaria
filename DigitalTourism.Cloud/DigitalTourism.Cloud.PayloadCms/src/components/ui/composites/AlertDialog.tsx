'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { WarningRegular, CheckmarkCircleRegular, InfoRegular, DismissCircleRegular, DismissRegular } from '@/components/ui/icons'
import { cn } from '@/components/ui/theme/cn'
import { Button } from '@/components/ui/primitives/Button'

type DialogVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: DialogVariant
  onConfirm: () => void | Promise<void>
  loading?: boolean
}

interface AlertNotificationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  variant?: 'error' | 'success' | 'warning' | 'info'
  buttonText?: string
}

const variantStyles: Record<
  DialogVariant,
  { icon: React.ReactNode; iconBg: string; buttonClass: string }
> = {
  default: {
    icon: <InfoRegular className="w-6 h-6 text-primary" />,
    iconBg: 'bg-primary/10',
    buttonClass: '',
  },
  destructive: {
    icon: <WarningRegular className="w-6 h-6 text-error-100" />,
    iconBg: 'bg-error-0',
    buttonClass: 'bg-error-100 hover:bg-error-200 text-white',
  },
  success: {
    icon: <CheckmarkCircleRegular className="w-6 h-6 text-primary-500" />,
    iconBg: 'bg-primary-50',
    buttonClass: 'bg-primary-500 hover:bg-primary-600 text-white',
  },
  warning: {
    icon: <WarningRegular className="w-6 h-6 text-warning-100" />,
    iconBg: 'bg-warning-0',
    buttonClass: 'bg-warning-100 hover:bg-warning-200 text-white',
  },
  info: {
    icon: <InfoRegular className="w-6 h-6 text-primary-400" />,
    iconBg: 'bg-primary-50',
    buttonClass: 'bg-primary-400 hover:bg-primary-500 text-white',
  },
}

const alertVariantStyles = {
  error: {
    icon: <DismissCircleRegular className="w-6 h-6 text-error-100" />,
    iconBg: 'bg-error-0',
    titleColor: 'text-error-100',
  },
  success: {
    icon: <CheckmarkCircleRegular className="w-6 h-6 text-primary-500" />,
    iconBg: 'bg-primary-50',
    titleColor: 'text-primary-700',
  },
  warning: {
    icon: <WarningRegular className="w-6 h-6 text-warning-100" />,
    iconBg: 'bg-warning-0',
    titleColor: 'text-warning-200',
  },
  info: {
    icon: <InfoRegular className="w-6 h-6 text-primary-400" />,
    iconBg: 'bg-primary-50',
    titleColor: 'text-primary-700',
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const styles = variantStyles[variant]

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  const isProcessing = loading || isLoading

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%]',
            'bg-background rounded-2xl shadow-2xl overflow-hidden',
            'duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          )}
        >
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 opacity-60 ring-offset-background transition-all hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <DismissRegular className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <div className="p-6 pb-4">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  styles.iconBg,
                )}
              >
                {styles.icon}
              </div>
              <div className="flex-1 pt-1">
                <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
                  {title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {description}
                </DialogPrimitive.Description>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-4 pt-2 bg-muted/50 border-t border-border">
            <Button
              variant="secondary"
              className="flex-1 rounded-xl h-11 font-medium"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              {cancelText}
            </Button>
            <Button
              className={cn('flex-1 rounded-xl h-11 font-medium', styles.buttonClass)}
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export function AlertNotification({
  open,
  onOpenChange,
  title,
  description,
  variant = 'info',
  buttonText = 'OK',
}: AlertNotificationProps) {
  const styles = alertVariantStyles[variant]

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%]',
            'bg-background rounded-2xl shadow-2xl overflow-hidden',
            'duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          )}
        >
          <div className="p-6 text-center">
            <div
              className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4',
                styles.iconBg,
              )}
            >
              {styles.icon}
            </div>

            <DialogPrimitive.Title className={cn('text-lg font-semibold mb-2', styles.titleColor)}>
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </DialogPrimitive.Description>
          </div>

          <div className="p-4 pt-0">
            <Button
              className="w-full rounded-xl h-11 font-medium"
              onClick={() => onOpenChange(false)}
            >
              {buttonText}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

type ConfirmOptions = Omit<ConfirmDialogProps, 'open' | 'onOpenChange' | 'onConfirm'>
type AlertOptions = Omit<AlertNotificationProps, 'open' | 'onOpenChange'>

interface DialogContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
  alert: (options: AlertOptions) => Promise<void>
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [confirmState, setConfirmState] = React.useState<{
    options: ConfirmOptions | null
    resolve: ((value: boolean) => void) | null
  }>({ options: null, resolve: null })

  const [alertState, setAlertState] = React.useState<{
    options: AlertOptions | null
    resolve: (() => void) | null
  }>({ options: null, resolve: null })

  const confirm = React.useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ options, resolve })
    })
  }, [])

  const alert = React.useCallback((options: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      setAlertState({ options, resolve })
    })
  }, [])

  const handleConfirmClose = (open: boolean) => {
    if (!open && confirmState.resolve) {
      confirmState.resolve(false)
      setConfirmState({ options: null, resolve: null })
    }
  }

  const handleConfirm = () => {
    if (confirmState.resolve) {
      confirmState.resolve(true)
      setConfirmState({ options: null, resolve: null })
    }
  }

  const handleAlertClose = (open: boolean) => {
    if (!open && alertState.resolve) {
      alertState.resolve()
      setAlertState({ options: null, resolve: null })
    }
  }

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}

      {confirmState.options && (
        <ConfirmDialog
          open={true}
          onOpenChange={handleConfirmClose}
          onConfirm={handleConfirm}
          {...confirmState.options}
        />
      )}

      {alertState.options && (
        <AlertNotification
          open={true}
          onOpenChange={handleAlertClose}
          {...alertState.options}
        />
      )}
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  return context
}
