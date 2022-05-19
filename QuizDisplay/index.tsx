import { Box, styled } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useEffect, useState } from 'react'
import { QDContext, QuizAnswerTypes, QuizDisplayProps } from './context'
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
export const QuizDisplay = ({
  quiz,
  onChange,
  containerProps,
  ...props
}: QuizDisplayProps) => {
  const [answer, setAnswer] = useState<QuizAnswerTypes>({})

  useEffect(() => {
    if (props.value && answer) {
      setAnswer(props.value)
    }
  }, [props.value])

  return (
    <QDContext.Provider value={{ quiz, answer, setAnswer, onChange }}>
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
