
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container } from '../Container'
import { Box, Button, Typography } from '@mui/material'
import { green } from '@mui/material/colors'

export interface NotFoundProps {
  Link: any
}
export const NotFound = ({ Link }: NotFoundProps) => {
  return (
    <Box py={6}>
      <Container maxWidth='xs'>
        <Box textAlign='center' flex={1}>
          <FontAwesomeIcon
            size='6x'
            icon={['fad', 'cactus']}
            style={{ color: green[500] }}
          />
          <Box mb={2} />
          <Typography variant='h1' color='primary' style={{ lineHeight: 1 }}>
            <strong>404</strong>
          </Typography>
          <Typography
            variant='h5'
            color='textSecondary'
            style={{ lineHeight: 1 }}
          >
            NOT FOUND
          </Typography>
          <Box mb={6} />
          <Button
            variant='outlined'
            startIcon={<FontAwesomeIcon icon={['fad', 'chevron-left']} />}
            color='primary'
            component={Link}
            to={`/`}
          >
            Go to HOME
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
