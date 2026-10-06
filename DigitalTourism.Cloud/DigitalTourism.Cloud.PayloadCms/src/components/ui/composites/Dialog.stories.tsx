import type { Meta, StoryObj } from '@storybook/react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './Dialog'
import { Button } from '../primitives/Button'
import { Input } from '../primitives/Input'
import { Label } from '../primitives/Label'

const meta = {
  title: 'Composites/Dialog',
  component: Dialog,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-10 max-w-2xl">
      <div>
        <h2 className="text-h4 font-semibold">Dialog</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Modal dialogs for different interaction patterns.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Simple confirmation */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary">Confirmation</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the item.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary">Cancel</Button>
              <Button variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Form dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Form Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="dialog-name">Name</Label>
                <Input id="dialog-name" defaultValue="John Doe" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dialog-email">Email</Label>
                <Input id="dialog-email" type="email" defaultValue="john@example.com" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary">Cancel</Button>
              <Button>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Info dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="tertiary">Info Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About this feature</DialogTitle>
              <DialogDescription>
                This dialog provides informational content with a single dismiss action.
              </DialogDescription>
            </DialogHeader>
            <p className="text-body-md text-muted-foreground">
              Dialogs can contain any content — text, forms, images, or other components.
              They overlay the page and require user interaction to dismiss.
            </p>
            <DialogFooter>
              <Button>Got it</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  ),
}
