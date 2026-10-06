import type { Meta, StoryObj } from '@storybook/react'
import {
  Pagination,
  PaginationPage,
  PaginationEllipsis,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
} from './Pagination'

const meta = {
  title: 'Composites/Pagination',
  component: Pagination,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const LinkBased: Story = {
  render: () => (
    <Pagination>
      <PaginationFirst href="/page/1" />
      <PaginationPrevious href="/page/2" />
      <PaginationPage href="/page/1">1</PaginationPage>
      <PaginationPage href="/page/2">2</PaginationPage>
      <PaginationPage href="/page/3" isActive>3</PaginationPage>
      <PaginationPage href="/page/4">4</PaginationPage>
      <PaginationPage href="/page/5">5</PaginationPage>
      <PaginationNext href="/page/4" />
      <PaginationLast href="/page/5" />
    </Pagination>
  ),
}

export const CallbackBased: Story = {
  render: () => (
    <Pagination>
      <PaginationFirst onClick={() => alert('First')} />
      <PaginationPrevious onClick={() => alert('Previous')} />
      <PaginationPage onClick={() => alert('Page 1')}>1</PaginationPage>
      <PaginationPage onClick={() => alert('Page 2')} isActive>2</PaginationPage>
      <PaginationPage onClick={() => alert('Page 3')}>3</PaginationPage>
      <PaginationNext onClick={() => alert('Next')} />
      <PaginationLast onClick={() => alert('Last')} />
    </Pagination>
  ),
}

export const ManyPages: Story = {
  render: () => (
    <Pagination>
      <PaginationFirst href="/page/1" />
      <PaginationPrevious href="/page/6" />
      <PaginationPage href="/page/1">1</PaginationPage>
      <PaginationEllipsis />
      <PaginationPage href="/page/6">6</PaginationPage>
      <PaginationPage href="/page/7" isActive>7</PaginationPage>
      <PaginationPage href="/page/8">8</PaginationPage>
      <PaginationEllipsis />
      <PaginationPage href="/page/20">20</PaginationPage>
      <PaginationNext href="/page/8" />
      <PaginationLast href="/page/20" />
    </Pagination>
  ),
}

export const FewPages: Story = {
  render: () => (
    <Pagination>
      <PaginationFirst disabled />
      <PaginationPrevious disabled />
      <PaginationPage isActive>1</PaginationPage>
      <PaginationPage href="/page/2">2</PaginationPage>
      <PaginationNext href="/page/2" />
      <PaginationLast href="/page/2" />
    </Pagination>
  ),
}
