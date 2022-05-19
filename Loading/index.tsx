
import { CircularProgress, styled } from '@mui/material'
import { useCore } from '../context'

export const Loading = styled((props) => {
  const { t } = useCore()
  return (
    <div {...props}>
      <CircularProgress
        size={48}
        color='inherit'
        style={{ marginBottom: '1rem' }}
      />
      {t('Loading')}
    </div>
  )
})({
  position: 'fixed',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#333',
  width: '100%',
  height: '100%',
  color: 'white'
})
