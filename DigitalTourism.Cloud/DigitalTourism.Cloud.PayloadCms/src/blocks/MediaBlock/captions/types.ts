export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type FontFamily = 'sans' | 'heading' | 'display' | 'mono'
export type FontWeight = 'thin' | 'normal' | 'bold' | 'black'
export type TextColor = 'white' | 'black' | 'gold' | 'red' | 'blue' | 'green'
export type VerticalPosition = 'top' | 'center' | 'bottom'
export type HorizontalAlignment = 'left' | 'center' | 'right'
export type CaptionBackground = 'dark' | 'light' | 'none'
export type ContainerWidth = 'narrow' | 'medium' | 'wide' | 'full'
export type TextShadow = 'none' | 'subtle' | 'strong' | 'outline'

export type CaptionAnimation =
  | 'none'
  | 'fadeIn'
  | 'fadeOut'
  | 'fadeInOut'
  | 'slideUp'
  | 'slideDown'
  | 'scale'
  | 'typewriter'

export interface CaptionStyle {
  fontSize?: FontSize
  fontFamily?: FontFamily
  fontWeight?: FontWeight
  textColor?: TextColor
  verticalPosition?: VerticalPosition
  horizontalAlignment?: HorizontalAlignment
  background?: CaptionBackground
  containerWidth?: ContainerWidth
  textShadow?: TextShadow
  animation?: CaptionAnimation
  x?: number // manual X position (0-100%)
  y?: number // manual Y position (0-100%)
}

export interface CaptionEntry extends CaptionStyle {
  startTime: number // seconds
  endTime: number // seconds
  text: string
}
