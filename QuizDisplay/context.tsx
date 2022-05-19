import { BoxProps } from '@mui/material'
import React, { createContext, useContext } from 'react'
import { QuizDocument } from '../QuizEditor'

export interface QuizAnswerTypes {
  truefalse?: string
  multiple?: number
  matching?: { [key: number]: string }
  sorting?: number[]
}

export interface QuizDisplayProps {
  value?: QuizAnswerTypes
  quiz: QuizDocument
  onChange: (answer: QuizAnswerTypes) => void
  containerProps?: BoxProps
}

export interface QDContextTypes
  extends Pick<QuizDisplayProps, 'quiz' | 'onChange'> {
  answer: QuizAnswerTypes
  setAnswer: React.Dispatch<React.SetStateAction<QuizAnswerTypes>>
}
export const QDContext = createContext<QDContextTypes>({
  quiz: {},
  answer: {},
  setAnswer: () => {},
  onChange: () => {}
})

export const useQD = () => useContext(QDContext)
