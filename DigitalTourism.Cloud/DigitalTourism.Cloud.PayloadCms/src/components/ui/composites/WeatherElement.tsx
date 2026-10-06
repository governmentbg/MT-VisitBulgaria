import { cn } from '@/components/ui/theme/cn'
import * as React from 'react'

export interface WeatherElementProps extends React.HTMLAttributes<HTMLDivElement> {
  city: string
  time?: string
  temperature: number
  unit?: 'C' | 'F'
  humidity?: number
  humidityLabel?: string
  conditionIcon?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

const WeatherElement: React.FC<WeatherElementProps> = ({
  city,
  time,
  temperature,
  unit = 'C',
  humidity,
  humidityLabel = 'humidity',
  conditionIcon,
  className,
  ref,
  ...props
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-start gap-4 rounded-[24px] bg-white px-7 py-[26px]',
        'shadow-[0px_2.5px_4.2px_rgba(0,0,0,0),0px_10.8px_8.7px_rgba(0,0,0,0.01),0px_26.6px_17.3px_rgba(0,0,0,0.01),0px_51.2px_33.9px_rgba(0,0,0,0.01),0px_86.2px_62.3px_rgba(0,0,0,0.02)]',
        className,
      )}
      ref={ref}
      {...props}
    >
      {conditionIcon && (
        <div className="flex size-[67px] shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary [&_svg]:h-8 [&_svg]:w-8">
          {conditionIcon}
        </div>
      )}
      <div className="flex flex-col gap-[13px]">
        <div className="flex items-baseline gap-6">
          <span className="text-lg font-medium tracking-[-0.63px] text-[#5c5c5c]">{city}</span>
          {time && (
            <span className="text-lg font-medium tracking-[-0.63px] text-[#5c5c5c]">{time}</span>
          )}
        </div>
        <span className="text-2xl font-medium tracking-[-0.36px] text-black">
          {temperature} °{unit}
        </span>
        {humidity !== undefined && (
          <div className="flex flex-col gap-[9px]">
            <p className="text-lg font-medium tracking-[-0.99px]">
              <span className="text-primary">{humidity}%</span>
              <span className="text-black"> {humidityLabel}</span>
            </p>
            <div className="h-[7px] w-52 overflow-hidden rounded-full bg-[#f5f5f5]">
              <div
                className="h-[6px] rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, Math.max(0, humidity))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { WeatherElement }
