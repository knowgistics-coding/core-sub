import {
  FormControl,
  FormControlProps,
  InputLabel,
  MenuItem,
  Select,
  SelectProps
} from '@mui/material'

import { useCore } from '../context'

interface SelectVisibilityProps extends Omit<SelectProps<string>, 'label'> {
  formControlProps?: Omit<FormControlProps, 'children'>
}

export const SelectVisibility = ({
  formControlProps,
  ...props
}: SelectVisibilityProps) => {
  const { t } = useCore()

  return (
    <FormControl {...formControlProps}>
      <InputLabel>{t('Visibility')}</InputLabel>
      <Select label={t('Visibility')} {...props}>
        <MenuItem value='' disabled>
          -- {t('Select?', { name: t('Visibility') })} --
        </MenuItem>
        <MenuItem value='private'>{t('Private')}</MenuItem>
        <MenuItem value='public'>{t('Public')}</MenuItem>
      </Select>
    </FormControl>
  )
}
