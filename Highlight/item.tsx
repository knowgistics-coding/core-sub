import {
  Box,
  BoxProps,
  Grid,
  GridProps,
  styled,
  Typography,
  TypographyProps
} from '@mui/material'

import { HighlightItemImage } from './item.image'
import { ImageDisplayProps } from '../ImageDisplay'

const AbsoluteContent = styled('div')({
  textAlign: 'center',
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.25)',
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
})

const GridFluid = styled(Grid)({
  width: '100%',
  height: '100%'
})

export interface HighlightItemProps {
  children?: React.ReactNode
  variant?: 'left' | 'right' | 'full'
  cover?: ImageDisplayProps
  primary?: React.ReactNode
  secondary?: React.ReactNode
  primaryTypographyProps?: TypographyProps
  secondaryTypographyProps?: TypographyProps
  contentProps?: BoxProps
}
export const HighlightItem = styled(
  ({
    children,
    variant,
    cover,
    primary,
    primaryTypographyProps,
    secondary,
    secondaryTypographyProps,
    contentProps,
    ...props
  }: HighlightItemProps) => {
    const hasContent = Boolean(children || primary || secondary)
    const gridProps = (() => {
      switch (variant) {
        case 'right':
          return {
            direction: 'row-reverse'
          } as GridProps
        default:
          return {}
      }
    })()
    const content = () => (
      <Box p={2} {...contentProps}>
        {primary && (
          <Typography variant='h6' paragraph {...primaryTypographyProps}>
            {primary}
          </Typography>
        )}
        {secondary && (
          <Typography variant='caption' paragraph {...secondaryTypographyProps}>
            {secondary}
          </Typography>
        )}
        {children}
      </Box>
    )

    return (
      <div {...props}>
        <GridFluid container {...gridProps}>
          {cover && (
            <Grid item xs={hasContent && variant !== 'full' ? 8 : 12}>
              <HighlightItemImage {...cover} ratio={360 / 960} />
            </Grid>
          )}
          {hasContent && variant !== 'full' && (
            <Grid item xs={cover ? 4 : 12}>
              {content()}
            </Grid>
          )}
          {hasContent && variant == 'full' && (
            <AbsoluteContent>{content()}</AbsoluteContent>
          )}
        </GridFluid>
      </div>
    )
  }
)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  border: `solid 1px ${theme.palette.grey[300]}`,
  borderRadius: parseInt(theme.shape.borderRadius.toString()) * 2,
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'grab',
  overflow: 'hidden',
  '&:active': {
    cursor: 'grabbing'
  }
}))
