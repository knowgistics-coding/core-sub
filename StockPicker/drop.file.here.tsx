import { alpha, Box, styled, Typography } from '@mui/material'


const Root = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  backgroundColor: alpha(theme.palette.primary.main, 0.8)
}))
const TypographyStyled = styled(Typography)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white'
})

export const DragFileHere = () => {
  return (
    <Root>
      <TypographyStyled variant='h6'>Drop File Here</TypographyStyled>
    </Root>
  )
}
