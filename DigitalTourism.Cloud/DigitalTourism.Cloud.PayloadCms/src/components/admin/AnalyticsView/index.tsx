import React from 'react'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav, type StepNavItem } from '@payloadcms/ui'
import type { AdminViewServerProps } from 'payload'
import { AnalyticsClient } from './index.client'

const steps: StepNavItem[] = [
  {
    url: '/analytics',
    label: 'Analytics',
  },
]

export const AnalyticsView: React.FC<AdminViewServerProps> = ({
  initPageResult,
  params,
  searchParams,
  viewActions,
}) => {
  const user = initPageResult.req.user
  if (!user || user.collection !== 'users') {
    return <p>You must be logged in to view this page.</p>
  }

  return (
    <DefaultTemplate
      visibleEntities={initPageResult.visibleEntities}
      i18n={initPageResult.req.i18n}
      payload={initPageResult.req.payload}
      locale={initPageResult.locale}
      params={params}
      permissions={initPageResult.permissions}
      user={initPageResult.req.user || undefined}
      searchParams={searchParams}
      viewActions={viewActions}
    >
      <SetStepNav nav={steps} />
      <Gutter>
        <AnalyticsClient />
      </Gutter>
    </DefaultTemplate>
  )
}

export default AnalyticsView
