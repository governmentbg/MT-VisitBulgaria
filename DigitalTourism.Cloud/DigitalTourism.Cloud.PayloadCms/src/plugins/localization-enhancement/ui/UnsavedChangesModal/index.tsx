'use client'

import React from 'react'
import { Button, Modal, useModal } from '@payloadcms/ui'
import './index.scss'

export const UNSAVED_CHANGES_MODAL_SLUG = 'unsaved-changes-locale-switch'

const baseClass = 'unsaved-changes-modal'

interface UnsavedChangesModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  const { isModalOpen } = useModal()

  if (!isModalOpen(UNSAVED_CHANGES_MODAL_SLUG)) {
    return null
  }

  return (
    <Modal slug={UNSAVED_CHANGES_MODAL_SLUG} className={baseClass}>
      <div
        className={`${baseClass}__wrapper`}
        role="alertdialog"
        aria-labelledby="unsaved-changes-heading"
        aria-describedby="unsaved-changes-description"
      >
        <div className={`${baseClass}__content`}>
          <h1 id="unsaved-changes-heading">Unsaved Changes</h1>
          <p id="unsaved-changes-description">
            You have unsaved changes. Switching locale will discard them. Do you want to continue?
          </p>
        </div>

        <div className={`${baseClass}__controls`}>
          <Button
            buttonStyle="secondary"
            id="unsaved-changes-cancel"
            onClick={onCancel}
            size="large"
            type="button"
          >
            Stay on this page
          </Button>
          <Button
            id="unsaved-changes-confirm"
            onClick={onConfirm}
            size="large"
          >
            Discard and switch
          </Button>
        </div>
      </div>
    </Modal>
  )
}
