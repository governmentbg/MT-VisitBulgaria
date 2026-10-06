export function getDayBadgeColor(dayIndex: number): string {
  const GOLDEN_ANGLE = 137.508
  const BASE_HUE = 210
  const hue = (BASE_HUE + dayIndex * GOLDEN_ANGLE) % 360
  return `hsl(${hue.toFixed(1)}, 70%, 40%)`
}
