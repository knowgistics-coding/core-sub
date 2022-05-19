import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, ListItem } from '@mui/material'

import { useCore } from '../../context'
import { useCE } from '../ctx'

export const CEButtonSave = () => {
  const { t } = useCore()
  const { onSave } = useCE()

  return (
    <ListItem divider>
      <Button
        fullWidth
        size='large'
        variant='contained'
        startIcon={<FontAwesomeIcon icon={['fad', 'save']} />}
        onClick={onSave}
      >
        {t('Save')}
      </Button>
    </ListItem>
  )
}
