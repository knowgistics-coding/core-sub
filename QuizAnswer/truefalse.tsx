import { Fragment } from 'react'
import { useCore } from '../context'
import { useQD } from './context'
import { ListButton } from './list.button'

export const QDTrueFalse = () => {
  const { t } = useCore()
  const { quiz, answer } = useQD()

  return (
    <Fragment>
      {quiz.truefalse?.answer === answer?.truefalse ? (
        <ListButton label={t(answer?.truefalse ? 'True' : 'False')} correct />
      ) : (
        <Fragment>
          <ListButton
            label={t('True')}
            correct={Boolean(quiz.truefalse?.answer) === true}
          />
          <ListButton
            label={t('False')}
            correct={Boolean(quiz.truefalse?.answer) === false}
          />
        </Fragment>
      )}
    </Fragment>
  )
}
