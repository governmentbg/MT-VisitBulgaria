import type { ReactNode } from 'react'

import { MapViewportHeight } from './MapViewportHeight'

export default function MapLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MapViewportHeight />
      <style>{`
        footer { display: none !important; }
      `}</style>
      <div className="absolute w-full h-dvh" style={{ paddingTop: 'var(--header-h, 0px)' }}>
        {children}
      </div>
    </>
  )
}
