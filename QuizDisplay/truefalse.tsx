
import {Fragment} from 'react'
import { useCore } from '../context'
import { useQD } from './context'
import { ListButton } from './list.button'

export const QDTrueFalse = () => {
  const { t } = useCore()
  const { answer, setAnswer, onChange } = useQD()

  const handleChange = (value: string) => () => {
    setAnswer((a) => ({ ...a, truefalse: value }))
    onChange({ ...answer, truefalse: value })
  }

  return (
    <Fragment>
      <ListButton
        label={t('True')}
        selected={answer?.truefalse === 'true'}
        onClick={handleChange('true')}
      />
      <ListButton
        label={t('False')}
        selected={answer?.truefalse === 'false'}
        onClick={handleChange('false')}
      />
    </Fragment>
  )
}
