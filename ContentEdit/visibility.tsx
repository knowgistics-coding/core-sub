import {
  FormControl,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material'
import { useEffect } from 'react'
import { useCore } from '../context'
import { useCE } from './ctx'

export const CEVisibility = () => {
  const { t } = useCore()
  const { data, setData } = useCE()

  const handleChange = ({ target: { value } }: SelectChangeEvent<string>) =>
    setData((d) => ({ ...d, visibility: value as 'private' | 'public' }))

  useEffect(() => {
    if (!Boolean(data?.visibility)) {
      setData((d) => ({ ...d, visibility: 'private' }))
    }
  }, [data?.visibility, setData])

  return (
    <ListItem divider>
      <FormControl fullWidth sx={{ mt: 1 }}>
        <InputLabel>{t('Visibility')}</InputLabel>
        <Select
          label={t('Visibility')}
          value={data?.visibility || ''}
          onChange={handleChange}
        >
          <MenuItem value='' disabled>
            -- {t('Visibility')} --
          </MenuItem>
          <MenuItem value='private'>{t('Private')}</MenuItem>
          <MenuItem value='public'>{t('Public')}</MenuItem>
        </Select>
      </FormControl>
    </ListItem>
  )
}
