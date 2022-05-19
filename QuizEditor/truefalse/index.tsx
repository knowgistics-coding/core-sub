import { useEffect } from 'react'
import { Panel } from '../panel'
import { MenuItem, Select } from '@mui/material'
import { useCore } from '../../context'
import { SelectChangeEvent } from '@mui/material'
import { useQEC } from '../context'
import update from 'react-addons-update'

export const OptionsTrueFalse = () => {
  const { t } = useCore()
  const { open, data, setData, onTabOpen } = useQEC()

  const handleChange = ({ target: { value } }: SelectChangeEvent<string>) => {
    setData((d) => update(d, { truefalse: { answer: { $set: value } } }))
  }

  useEffect(() => {
    if (
      !data?.truefalse?.answer ||
      !['true', 'false'].includes(String(data?.truefalse?.answer))
    ) {
      setData((d) => ({ ...d, truefalse: { answer: 'true' } }))
    }
  }, [data?.truefalse?.answer])

  return (
    <Panel
      expanded={open['answer']}
      title={t('Answer')}
      onChange={onTabOpen('answer')}
    >
      <Select
        fullWidth
        variant='outlined'
        value={data?.truefalse?.answer || 'true'}
        onChange={handleChange}
      >
        <MenuItem value={'true'}>{t('True')}</MenuItem>
        <MenuItem value={'false'}>{t('False')}</MenuItem>
      </Select>
    </Panel>
  )
}
