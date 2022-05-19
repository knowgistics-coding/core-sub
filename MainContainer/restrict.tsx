
import { IconStyled } from '../IconStyled'
import { Box, Typography } from '@mui/material'
import { Container } from '../Container'
import { useMC } from './ctx'

export const MCRestrict = () => {
  const { dense } = useMC()

  return (
    <Container maxWidth='xs'>
      <Box py={dense ? 6 : 0} textAlign={'center'}>
        <IconStyled icon={['fad', 'ban']} size='8x' />
        <Typography mt={2} color='textSecondary'>
          You don't have permission to view this page
        </Typography>
      </Box>
    </Container>
  )
}
