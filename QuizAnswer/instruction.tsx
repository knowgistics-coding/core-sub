import { styled, Typography, TypographyProps } from '@mui/material'

import { useCore } from '../context'
import { useQD } from './context'

const TypoStyled = styled((props: TypographyProps) => (
  <Typography variant='h6' paragraph {...props} />
))({})

export const QDInstruction = () => {
  const { t } = useCore()
  const { quiz } = useQD()

  switch (quiz.type) {
    case 'truefalse':
      return (
        <TypoStyled>{t('Identify if the following true or false')}</TypoStyled>
      )
    case 'matching':
      return <TypoStyled>{t('Match the answers to the questions')}</TypoStyled>
    case 'sorting':
      return <TypoStyled>{t('Sorting the answer options')}</TypoStyled>
    default:
      return <TypoStyled>{t('Choose to best answer')}</TypoStyled>
  }
}
