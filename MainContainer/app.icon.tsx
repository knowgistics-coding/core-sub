
import { Box, styled } from '@mui/material'

const Root = styled(Box, { shouldForwardProp: (props) => props !== 'open' })<{
  open: boolean
}>(({ theme, open }) => ({
  display: 'grid',
  width: '1em',
  height: '1em',
  gridTemplateColumns: '1fr 1fr 1fr',
  gridTemplateRows: '1fr 1fr 1fr',
  columnGap: '0.1em',
  rowGap: '0.1em',
  '&>div': {
    backgroundColor: theme.palette.text.primary,
    width: '100%',
    height: '100%',
    fontSize: '0.3rem',
    justifySelf: 'center',
    alignSelf: 'center',
    transition: 'all 0.25s',
    opacity: 'var(--fa-secondary-opacity, 0.4)'
  },
  '&>div:nth-of-type(4)': {
    backgroundColor: 'var(--fa-primary-color, currentColor)',
    opacity: 1
  },
  '&>div:nth-of-type(6)': {
    backgroundColor: 'var(--fa-primary-color, currentColor)',
    opacity: 1
  },
  '&>div:nth-of-type(8)': {
    backgroundColor: 'var(--fa-primary-color, currentColor)',
    opacity: 1
  },
  ...(open
    ? {
        '&>div:nth-of-type(2)': {
          backgroundColor: 'var(--fa-primary-color, currentColor)',
          opacity: 1
        },
        '&>div:nth-of-type(8)': {
          backgroundColor: 'var(--fa-secondary-color, currentColor)',
          opacity: 'var(--fa-secondary-opacity, 0.4)'
        }
      }
    : {})
}))

export interface AppIconProps {
  open: boolean
}
export const AppIcon = ({ open }: AppIconProps) => {
  const items = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  return (
    <Root open={open}>
      {items.map((key) => (
        <div key={key} />
      ))}
    </Root>
  )
}
