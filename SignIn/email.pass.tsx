import React, { useState } from 'react'
import {
  Box,
  Button,
  Link,
  Slide,
  styled,
  TextField,
  Typography
} from '@mui/material'
import { PassField } from './pass.field'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCore } from '../context'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAlerts } from '../Alerts'
import { PopupSignIn } from './popup.signin'

const Root = styled('div')({
  '&>:not(:last-child)': {
    marginBottom: '1rem'
  }
})
const LinkButton = styled(Link)({
  cursor: 'pointer',
  '&:not(:last-child)': {
    marginBottom: '0.5rem'
  }
})

export const EmailPass = ({
  tab,
  onChangeTab
}: {
  tab: string
  onChangeTab: (tab: string) => () => void
}) => {
  const { fb, t } = useCore()
  const { addAlert } = useAlerts()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{ [key: string]: string }>({
    email: '',
    pass: ''
  })

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setData((d) => ({ ...d, [field]: value }))
    }
  const handleEmailPassSignIn = async () => {
    setLoading(true)
    if (fb?.auth) {
      await signInWithEmailAndPassword(fb?.auth, data.email, data.pass).catch(
        (err) => addAlert({ label: err.message, severity: 'error' })
      )
    }
    setLoading(false)
  }

  return (
    <Slide in={tab === 'emailpass'} direction='right' unmountOnExit>
      <Root>
        <Typography variant='h5' textAlign='center'>
          {t('Welcome').toUpperCase()}
        </Typography>
        <Box pt={3} />
        <TextField
          fullWidth
          label={t('Email')}
          value={data.email}
          disabled={loading}
          onChange={handleChange('email')}
        />
        <PassField
          label={t('Password')}
          value={data.pass || ''}
          onChange={handleChange('pass')}
          disabled={loading}
        />
        <Button
          fullWidth
          variant='outlined'
          size='large'
          startIcon={<FontAwesomeIcon icon={['far', 'sign-in']} />}
          disabled={!Boolean(data.email && data.pass) || loading}
          onClick={handleEmailPassSignIn}
        >
          {t('Sign In')}
        </Button>
        <PopupSignIn />
        <Box textAlign={'center'} display={'flex'} flexDirection={'column'}>
          <LinkButton
            variant='caption'
            color={'textSecondary'}
            onClick={onChangeTab('register')}
          >
            <FontAwesomeIcon
              icon={['far', 'user-plus']}
              style={{ marginRight: '0.5rem' }}
            />
            {t('Register')}
          </LinkButton>
          <LinkButton
            variant='caption'
            color={'textSecondary'}
            onClick={onChangeTab('forget')}
          >
            {t('Forget Password')}
          </LinkButton>
        </Box>
      </Root>
    </Slide>
  )
}
