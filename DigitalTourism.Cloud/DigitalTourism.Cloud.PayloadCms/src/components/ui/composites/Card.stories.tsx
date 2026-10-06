import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
import { Button } from '../primitives/Button'
import { Input } from '../primitives/Input'
import { Label } from '../primitives/Label'

const meta = {
  title: 'Composites/Card',
  component: Card,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-10 max-w-4xl">
      <div>
        <h2 className="text-h4 font-semibold">Card</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Card compositions for different use cases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Card</CardTitle>
            <CardDescription>A simple card with header and content.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-body-md">Card content goes here. This is the main body area.</p>
          </CardContent>
        </Card>

        {/* Card with footer */}
        <Card>
          <CardHeader>
            <CardTitle>With Footer</CardTitle>
            <CardDescription>Card with action buttons in the footer.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-body-md">Some content that needs user action below.</p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="secondary" size="sm">Cancel</Button>
            <Button variant="primary" size="sm">Save</Button>
          </CardFooter>
        </Card>

        {/* Card with form */}
        <Card>
          <CardHeader>
            <CardTitle>Form Card</CardTitle>
            <CardDescription>Card containing a form layout.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Submit</Button>
          </CardFooter>
        </Card>

        {/* Minimal card */}
        <Card className="p-6">
          <p className="text-body-sm text-muted-foreground">Minimal</p>
          <p className="text-h4 font-semibold mt-1">1,234</p>
          <p className="text-body-sm text-primary mt-1">+12% from last month</p>
        </Card>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area.</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary">Action</Button>
      </CardFooter>
    </Card>
  ),
}
