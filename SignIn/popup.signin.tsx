
import { Box, IconButton, styled } from '@mui/material'
import { ReactComponent as GoogleLogo } from './google.logo.svg'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useCore } from '../context'
import { useAlerts } from '../Alerts'

const IconButtonOutlined = styled(IconButton)(({ theme }) => ({
  border: `solid 1px ${theme.palette.grey[300]}`
}))

export const PopupSignIn = () => {
  const { fb } = useCore()
  const { addAlert } = useAlerts()

  const handleGoogleSign = () => {
    if (fb?.auth) {
      const provider = new GoogleAuthProvider()
      signInWithPopup(fb.auth, provider).catch((err) =>
        addAlert({ label: err.message })
      )
    }
  }

  return (
    <Box display={'flex'} justifyContent={'center'} mt={6} mb={2}>
      <IconButtonOutlined onClick={handleGoogleSign}>
        <GoogleLogo style={{ width: 32, height: 32 }} />
      </IconButtonOutlined>
    </Box>
  )
}
