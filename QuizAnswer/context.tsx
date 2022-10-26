import { BoxProps } from '@mui/material'
import { createContext, useContext } from 'react'
import { QuizAnswerTypes } from '../QuizDisplay'
import { QuizDocument } from '../QuizEditor'

// export interface QuizAnswerTypes {
//   truefalse?: string
//   multiple?: number
//   matching?: { [key: number]: string }
//   sorting?: number[]
// }

export interface QuizDisplayProps {
  answer?: QuizAnswerTypes
  quiz: QuizDocument
  containerProps?: BoxProps
}

export interface QDContextTypes
  extends Pick<QuizDisplayProps, 'quiz' | 'answer'> {}
export const QDContext = createContext<QDContextTypes>({
  quiz: {}
})

export const useQD = () => useContext(QDContext)
