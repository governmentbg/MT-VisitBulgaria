export const timeToFrame = (seconds: number, fps: number): number =>
  Math.floor(seconds * fps)
