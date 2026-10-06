import type { Meta, StoryObj } from '@storybook/react'
import { MapCanvas } from '../MapCanvas/MapCanvas'
import { MapControls } from '../MapCanvas/MapControls'
import { EmbeddedMap } from './EmbeddedMap'

/**
 * EmbeddedMap keeps in-page maps from trapping the page scroll on a phone.
 *
 * It switches on `(max-width: 767px), (pointer: coarse)`, so to see the compact
 * behaviour use Storybook's mobile viewport (or a touch device): the map freezes,
 * a "View map" button appears, and tapping it opens the same map full screen.
 */
const meta: Meta<typeof EmbeddedMap> = {
  title: 'MapExplorer/EmbeddedMap',
  component: EmbeddedMap,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof EmbeddedMap>

const SOFIA: [number, number] = [42.6977, 23.3219]

/** Scroll the surrounding text on a mobile viewport — dragging the map must not block it. */
export const InAScrollingPage: Story = {
  render: () => (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <p className="text-sm text-muted-foreground">
        Scroll down. On a mobile viewport, a vertical swipe that starts on the map should
        scroll this page rather than pan the map.
      </p>

      <EmbeddedMap
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:aspect-[2/1]"
        viewLabel="View map"
        closeLabel="Close map"
      >
        {({ interactive }) => (
          <MapCanvas center={SOFIA} zoom={13} interactive={interactive}>
            {interactive && <MapControls />}
          </MapCanvas>
        )}
      </EmbeddedMap>

      {Array.from({ length: 12 }).map((_, i) => (
        <p key={i} className="text-sm">
          Filler paragraph {i + 1} — content below the map.
        </p>
      ))}
    </div>
  ),
}
