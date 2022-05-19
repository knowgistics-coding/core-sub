import React, { useState } from 'react'
import { Box, Button, Slide, styled, TextField } from '@mui/material'
import { useCore } from '../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PassField } from './pass.field'
import { useAlerts } from '../Alerts'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { validateEmail } from '../func'

const Container = styled(Box)({
  '&>:not(:last-child)': {
    marginBottom: '1rem'
  }
})

export const Register = ({
  tab,
  onChangeTab
}: {
  tab: string
  onChangeTab: (tab: string) => () => void
}) => {
  const { t, fb } = useCore()
  const { addAlert } = useAlerts()
  const [data, setData] = useState<{ [key: string]: string }>({})

  const isComplete = {
    email: validateEmail(data.email),
    pass: Boolean(data.pass && data.pass.length >= 8),
    cfpass: Boolean(data.cfpass && data.pass && data.cfpass === data.pass)
  }
  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setData((d) => ({ ...d, [field]: value }))
    }
  const handleRegister = () => {
    if (fb?.auth) {
      createUserWithEmailAndPassword(fb?.auth, data.email, data.pass)
        .then(({ user }) => {
          addAlert({ label: `Register ${user.email} success` })
        })
        .catch((err) => {
          addAlert({ label: err.message, severity: 'error' })
        })
    }
  }

  return (
    <Slide in={tab === 'register'} direction='left' unmountOnExit>
      <div>
        <Button
          size='small'
          startIcon={<FontAwesomeIcon icon={['fad', 'chevron-left']} />}
          onClick={onChangeTab('emailpass')}
        >
          {t('Sign In')}
        </Button>
        <Container mt={3}>
          <TextField
            fullWidth
            label={t('Email')}
            value={data.email || ''}
            onChange={handleChange('email')}
            error={!isComplete.email}
            helperText={!isComplete.email && 'Invalid E-mail'}
          />
          <PassField
            label={t('Password')}
            value={data.pass || ''}
            onChange={handleChange('pass')}
            error={!isComplete.pass}
            helperText={
              !isComplete.pass && 'Password must more than 8 charecters'
            }
          />
          <PassField
            label={t('Confirm Password')}
            value={data.cfpass || ''}
            onChange={handleChange('cfpass')}
            error={!isComplete.cfpass}
            helperText={!isComplete.cfpass && 'Password not match'}
          />
          <Button
            fullWidth
            variant='outlined'
            size='large'
            startIcon={<FontAwesomeIcon icon={['fad', 'user-plus']} />}
            onClick={handleRegister}
          >
            {t('Register')}
          </Button>
        </Container>
      </div>
    </Slide>
  )
}
