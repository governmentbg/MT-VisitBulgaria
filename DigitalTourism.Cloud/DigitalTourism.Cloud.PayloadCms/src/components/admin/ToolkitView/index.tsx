import React from 'react'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { SetStepNav, type StepNavItem } from '@payloadcms/ui'
import type { AdminViewServerProps } from 'payload'
import { isAdmin } from '@/access/accessHelpers'
import { ToolkitClient } from './index.client'
import { TOOLKIT_ROUTE } from './constants'

const steps: StepNavItem[] = [
  {
    url: TOOLKIT_ROUTE,
    label: 'Admin Tools',
  },
]

export const ToolkitView: React.FC<AdminViewServerProps> = ({
  initPageResult,
  params,
  searchParams,
  viewActions,
}) => {
  const user = initPageResult.req.user

  if (!isAdmin(user)) {
    return <p>Unauthorized — admin access required.</p>
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
      <ToolkitClient />
    </DefaultTemplate>
  )
}

export default ToolkitView
