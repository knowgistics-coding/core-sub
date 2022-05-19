import { Box, styled } from '@mui/material'
import { grey } from '@mui/material/colors'

export const ImageContainer = styled(Box)<{ ratio?: number }>(({ ratio }) => ({
  position: 'relative',
  display: 'block',
  backgroundColor: grey[100],
  '&:after': {
    content: '""',
    display: 'block',
    paddingTop: `calc(100% * ${ratio || 9 / 16})`
  }
}))
