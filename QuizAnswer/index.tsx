import { Box, styled } from '@mui/material'
import { grey } from '@mui/material/colors'

import { QDContext, QuizDisplayProps } from './context'
import { QDInstruction } from './instruction'
import { QDMatching } from './matching'
import { QDMultiple } from './multiple'
import { QDQuestion } from './question'
import { QDSorting } from './sorting'
import { QDTrueFalse } from './truefalse'

const Root = styled(Box)(({ theme }) => ({
  border: `solid 1px ${grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2)
}))

export type { QuizAnswerTypes } from './context'
export const QuizAnswer = ({
  quiz,
  answer,
  containerProps
}: QuizDisplayProps) => {
  return (
    <QDContext.Provider value={{ quiz, answer }}>
      <Box {...containerProps}>
        <QDInstruction />
        <Root>
          <QDQuestion />
          {quiz.type === 'truefalse' && <QDTrueFalse />}
          {quiz.type === 'multiple' && <QDMultiple />}
          {quiz.type === 'matching' && <QDMatching />}
          {quiz.type === 'sorting' && <QDSorting />}
        </Root>
      </Box>
    </QDContext.Provider>
  )
}
