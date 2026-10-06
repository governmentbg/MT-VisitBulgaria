export type GradientConfig = {
  enabled: boolean
  color: string
  height: number
}

export type OverlayTextFont = 'heading' | 'display' | 'sans'

export type OverlayTextConfig = {
  text: string
  positionX: number
  positionY: number
  font?: OverlayTextFont
  fontSize?: string
}

export type SpacerSceneProps = {
  image: string
  alt?: string
  height?: string
  fadeIn?: GradientConfig
  fadeOut?: GradientConfig
  overlayText?: OverlayTextConfig
  offsetTop?: number
  offsetBottom?: number
  className?: string
}
