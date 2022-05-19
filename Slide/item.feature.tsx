
import { StockDisplay, StockDisplayProps } from '../StockDisplay'

export const SlideItemFeature = (props: StockDisplayProps) => {
  return (
    <StockDisplay
      {...props}
      rootProps={{
        sx: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          filter: 'brightness(0.7)'
        }
      }}
    />
  )
}
