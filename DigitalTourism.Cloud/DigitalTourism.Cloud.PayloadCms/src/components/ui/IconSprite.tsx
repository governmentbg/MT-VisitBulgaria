/**
 * SVG Sprite — rendered once in the layout to deduplicate inline SVG icons.
 *
 * Fluent UI icons produce full inline <svg> elements for every instance.
 * On pages with many cards/carousels, the same ~1 KB icon SVG is repeated
 * 20-50+ times, adding 150+ KB of duplicate HTML.
 *
 * This sprite defines each icon once as a <symbol>; consumers reference it
 * with <svg><use href="#sprite-{name}" /></svg> (~50 bytes each).
 */
const IconSprite: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="hidden" aria-hidden="true">
    {/* HeartRegular (outlined heart) */}
    <symbol id="sprite-heart-regular" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="m10.5 16.8 6.24-6.3a4.4 4.4 0 0 0-.02-6.19 4.3 4.3 0 0 0-6.13-.01l-.6.6-.6-.61a4.3 4.3 0 0 0-6.13-.02 4.4 4.4 0 0 0 .02 6.2l6.27 6.33c.26.27.69.27.95 0ZM11.3 5a3.3 3.3 0 0 1 4.71.02 3.4 3.4 0 0 1 .02 4.78l-6 6.06-6.04-6.1a3.4 3.4 0 0 1-.02-4.78 3.3 3.3 0 0 1 4.7.01l.97.97c.2.2.51.2.7 0L11.3 5Z"
      />
    </symbol>
    {/* HeartFilled (solid heart) */}
    <symbol id="sprite-heart-filled" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M9.39 4.29a4.3 4.3 0 0 0-6.13-.02 4.4 4.4 0 0 0 .02 6.2l6.27 6.33c.26.27.69.27.95 0l6.24-6.3a4.4 4.4 0 0 0-.02-6.19 4.3 4.3 0 0 0-6.13-.01l-.6.6-.6-.61Z"
      />
    </symbol>
    {/* ArrowUpRightFilled */}
    <symbol id="sprite-arrow-up-right" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M8 3.75c0-.41.34-.75.75-.75h7.5c.41 0 .75.34.75.75v7.5a.75.75 0 1 1-1.5 0V5.56L4.28 16.78a.75.75 0 0 1-1.06-1.06L14.44 4.5h-5.7A.75.75 0 0 1 8 3.75Z"
      />
    </symbol>
    {/* LocationRegular */}
    <symbol id="sprite-location" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M5.05 4.05a7 7 0 1 1 9.9 9.9l-1.13 1.12-2.43 2.37a2 2 0 0 1-2.64.12l-.14-.12-2.04-1.99-1.52-1.5a7 7 0 0 1 0-9.9Zm9.2.7a6 6 0 0 0-8.67 8.32l.17.18.58.57 2.98 2.9.09.08a1 1 0 0 0 1.2 0l.1-.08 2.22-2.17 1.32-1.3.18-.18a6 6 0 0 0-.18-8.31ZM10 6.26a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5Zm0 1a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z"
      />
    </symbol>
    {/* ChevronLeftRegular */}
    <symbol id="sprite-chevron-left" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M12.35 15.85a.5.5 0 0 1-.7 0L6.16 10.4a.55.55 0 0 1 0-.78l5.49-5.46a.5.5 0 1 1 .7.7L7.2 10l5.16 5.15c.2.2.2.5 0 .7Z"
      />
    </symbol>
    {/* ChevronRightRegular */}
    <symbol id="sprite-chevron-right" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M7.65 4.15c.2-.2.5-.2.7 0l5.49 5.46c.21.22.21.57 0 .78l-5.49 5.46a.5.5 0 0 1-.7-.7L12.8 10 7.65 4.85a.5.5 0 0 1 0-.7Z"
      />
    </symbol>
    {/* ChevronDownRegular */}
    <symbol id="sprite-chevron-down" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0Z"
      />
    </symbol>
    {/* SearchRegular */}
    <symbol id="sprite-search" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M13.73 14.44a6.5 6.5 0 1 1 .7-.7l3.42 3.4a.5.5 0 0 1-.63.77l-.07-.06-3.42-3.41Zm-.71-.71A5.54 5.54 0 0 0 15 9.5a5.5 5.5 0 1 0-1.98 4.23Z"
      />
    </symbol>
    {/* StarFilled */}
    <symbol id="sprite-star-filled" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M9.1 2.9a1 1 0 0 1 1.8 0l1.93 3.91 4.31.63a1 1 0 0 1 .56 1.7l-3.12 3.05.73 4.3a1 1 0 0 1-1.45 1.05L10 15.51l-3.86 2.03a1 1 0 0 1-1.45-1.05l.74-4.3L2.3 9.14a1 1 0 0 1 .56-1.7l4.31-.63L9.1 2.9Z"
      />
    </symbol>
    {/* MapFilled (solid map) */}
    <symbol id="sprite-map" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M7.36 2.07a.5.5 0 0 1 .39-.04L12.5 3.72l4.15-1.66a.5.5 0 0 1 .66.36l.01.08v12a.5.5 0 0 1-.31.46l-4.5 1.8a.5.5 0 0 1-.37 0L7.5 15.08l-4.15 1.66A.5.5 0 0 1 2.7 16.4l-.01-.08V4.5a.5.5 0 0 1 .31-.46l4.36-1.97ZM8 3.78v10.44l4 1.56V5.42L8 3.78Z"
      />
    </symbol>
  </svg>
)

export { IconSprite }
