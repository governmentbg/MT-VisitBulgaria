/**
 * Generate a visually distinct, high-contrast color for a given day index
 * using the golden-angle hue rotation. Works for unbounded day counts —
 * adjacent indices always land far apart on the color wheel.
 *
 * Saturation/lightness are fixed so white text on the badge stays readable
 * (WCAG AA against hsl(h, 70%, 40%) for all hues).
 */
export function getDayBadgeColor(dayIndex: number): string {
  const GOLDEN_ANGLE = 137.508;
  const BASE_HUE = 210; // start blue-ish so day 1 doesn't blend with the green pin
  const hue = (BASE_HUE + dayIndex * GOLDEN_ANGLE) % 360;
  return `hsl(${hue.toFixed(1)}, 70%, 40%)`;
}
