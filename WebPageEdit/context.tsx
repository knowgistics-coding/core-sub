import { GridProps } from '@mui/material'
import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { CoreContextTypes } from '../context'
import { WebPageDocument } from './types'

export interface WebPageEditProps {
  data: WebPageDocument
  setData: Dispatch<SetStateAction<WebPageDocument>>
  onSave: () => void | Promise<void>
  back?: string
  value?: WebPageDocument
  onChange?: (doc: WebPageDocument) => void
  GridContainerProps?: Omit<GridProps, 'children' | 'container' | 'item'>
}

export interface WebPageEditContextProps extends WebPageEditProps {
  t: CoreContextTypes['t']
}
export const WebPageEditContext = createContext<WebPageEditContextProps>({
  t: () => '',
  data: {},
  setData: () => {},
  onSave: () => {}
})

export const useWebPE = () => useContext(WebPageEditContext)
