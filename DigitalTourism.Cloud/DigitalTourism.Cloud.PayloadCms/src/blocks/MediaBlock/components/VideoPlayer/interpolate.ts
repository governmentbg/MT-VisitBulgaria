interface InterpolateOptions {
  extrapolateLeft?: 'clamp' | 'extend'
  extrapolateRight?: 'clamp' | 'extend'
}

export function interpolate(
  value: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
  options?: InterpolateOptions,
): number {
  const { extrapolateLeft = 'extend', extrapolateRight = 'extend' } = options ?? {}

  // Clamp before interpolation if needed
  if (value <= inputRange[0]) {
    if (extrapolateLeft === 'clamp') return outputRange[0]
  }
  if (value >= inputRange[inputRange.length - 1]) {
    if (extrapolateRight === 'clamp') return outputRange[outputRange.length - 1]
  }

  // Find the segment
  let i = 1
  while (i < inputRange.length - 1 && value > inputRange[i]) i++

  const inMin = inputRange[i - 1]
  const inMax = inputRange[i]
  const outMin = outputRange[i - 1]
  const outMax = outputRange[i]

  const t = inMax === inMin ? 0 : (value - inMin) / (inMax - inMin)
  return outMin + t * (outMax - outMin)
}
