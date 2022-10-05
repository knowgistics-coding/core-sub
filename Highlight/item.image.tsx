import { styled } from '@mui/material'
import { StockDisplay, StockDisplayProps } from '../StockDisplay'

export type HighlightItemImageProps = StockDisplayProps & {
  className?: string
}
export const HighlightItemImage = styled(
  ({ className, ...props }: HighlightItemImageProps) => {
    return (
      <div className={className}>
        <StockDisplay {...props} />
      </div>
    )
  }
)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  '&>div': {
    width: '100%',
    height: '100%'
  }
}))
