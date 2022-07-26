import { Box, styled } from '@mui/material'

export const ImageContainer = styled(Box)<{ ratio?: number }>(({ theme, ratio }) => ({
  position: 'relative',
  display: 'block',
  backgroundColor: theme.palette.background.paper,
  '&:after': {
    content: '""',
    display: 'block',
    paddingTop: `calc(100% * ${ratio || 9 / 16})`
  }
}))
