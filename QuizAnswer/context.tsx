import { BoxProps } from '@mui/material'
import { createContext, useContext } from 'react'
import { Question, QuestionAnswer } from '../Controller'

export interface QuizDisplayProps {
  answer?: QuestionAnswer
  quiz: Question
  containerProps?: BoxProps
}

export interface QDContextTypes
  extends Pick<QuizDisplayProps, 'quiz' | 'answer'> {}
export const QDContext = createContext<QDContextTypes>({
  quiz: new Question()
})

export const useQD = () => useContext(QDContext)
