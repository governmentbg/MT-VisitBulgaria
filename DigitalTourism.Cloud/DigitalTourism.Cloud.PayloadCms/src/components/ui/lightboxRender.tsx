'use client'

import React from 'react'
import {
  ChevronLeftRegular,
  ChevronRightRegular,
  DismissRegular,
  ZoomInRegular,
  ZoomOutRegular,
} from '@/components/ui/icons'

const size = 24

/** Shared render overrides for all Lightbox instances — uses Fluent UI icons. */
export const lightboxRender = {
  iconPrev: () => <ChevronLeftRegular style={{ fontSize: size }} />,
  iconNext: () => <ChevronRightRegular style={{ fontSize: size }} />,
  iconClose: () => <DismissRegular style={{ fontSize: size }} />,
  iconZoomIn: () => <ZoomInRegular style={{ fontSize: size }} />,
  iconZoomOut: () => <ZoomOutRegular style={{ fontSize: size }} />,
}
