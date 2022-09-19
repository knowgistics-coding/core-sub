import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Slide, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useCore } from '../context'
import { validateEmail } from '../func'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useAlerts } from '../Alerts'

export const ForgetPassword = ({
  tab,
  onChangeTab
}: {
  tab: string
  onChangeTab: (tab: string) => () => void
}) => {
  const { fb, t } = useCore()
  const { addAlert } = useAlerts()
  const [email, setEMail] = useState<string>('')

  const handleSendEmail = () => {
    if (fb?.auth) {
      sendPasswordResetEmail(fb.auth, email)
        .then(() => {
          addAlert({ label: t('Send Reset Password', { email }) })
          onChangeTab('emailpass')()
        })
        .catch((err) => addAlert({ label: err.message, severity: 'error' }))
    }
  }

  return (
    <Slide in={tab === 'forget'} direction='left' unmountOnExit>
      <div style={{ width: '100%' }}>
        <Box mb={2}>
          <Button
            onClick={onChangeTab('emailpass')}
            size='small'
            startIcon={<FontAwesomeIcon icon={['far', 'chevron-left']} />}
          >
            {t('Sign In')}
          </Button>
        </Box>
        <TextField
          fullWidth
          label={t('Email')}
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value
            setEMail(value)
          }}
          error={!validateEmail(email)}
          helperText={!validateEmail(email) && t('Invalid Email')}
        />
        <Button
          variant='outlined'
          size='large'
          fullWidth
          sx={{ mt: 1 }}
          startIcon={<FontAwesomeIcon icon={['far', 'paper-plane']} />}
          disabled={!validateEmail(email)}
          onClick={handleSendEmail}
        >
          {t('Send Email')}
        </Button>
      </div>
    </Slide>
  )
}
