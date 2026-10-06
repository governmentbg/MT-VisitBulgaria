import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CreateTripDialog } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'

const meta = {
  title: 'Trips/CreateTripDialog',
  component: CreateTripDialog,
  parameters: { layout: 'centered', ...figmaDesign('1655:28128') },
} satisfies Meta<typeof CreateTripDialog>

export default meta
type Story = StoryObj<typeof meta>

const InteractiveDialog = ({ isSubmitting = false }: { isSubmitting?: boolean }) => {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button onClick={() => setOpen(true)} className="rounded-lg border px-4 py-2 text-sm">
        Open Dialog
      </button>
      <CreateTripDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={async (data) => {
          console.log('Submit:', data)
          await new Promise((r) => setTimeout(r, 1000))
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export const Showcase: Story = {
  args: { open: true, onOpenChange: () => {}, onSubmit: () => {} },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-h4 font-semibold">CreateTripDialog</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Modal for creating a new trip plan (Figma Screen 2).
        </p>
      </div>
      <InteractiveDialog />
    </div>
  ),
}

export const EmptyForm: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onSubmit: () => {},
  },
}

export const Submitting: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onSubmit: () => {},
    isSubmitting: true,
  },
}
