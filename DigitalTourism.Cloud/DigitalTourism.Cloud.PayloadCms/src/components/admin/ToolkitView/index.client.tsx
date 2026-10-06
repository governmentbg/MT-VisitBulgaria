'use client'

import React, { useState } from 'react'
import { Gutter } from '@payloadcms/ui'
import { getAdminTools } from '@/admin-tools'
import './index.scss'

const baseClass = 'toolkit-view'

export const ToolkitClient: React.FC = () => {
  const tools = getAdminTools()
  const [activeTab, setActiveTab] = useState(tools[0]?.id ?? '')

  const activeTool = tools.find((t) => t.id === activeTab)

  return (
    <div className={baseClass}>
      <div className="tabs-field__tabs-wrap">
        <div className="tabs-field__tabs">
          {tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className={`tabs-field__tab-button${tool.id === activeTab ? ' tabs-field__tab-button--active' : ''}`}
              onClick={() => setActiveTab(tool.id)}
            >
              {tool.label}
            </button>
          ))}
        </div>
      </div>
      {activeTool && (
        <Gutter>
          <div className={`${baseClass}__panel`}>
            <p className={`${baseClass}__panel-description`}>{activeTool.description}</p>
            <div className={`${baseClass}__panel-content`}>
              <activeTool.Component />
            </div>
          </div>
        </Gutter>
      )}
    </div>
  )
}

export default ToolkitClient
