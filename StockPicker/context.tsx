import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { StockImageController, StockImageTypes } from './controller'

export interface StockPickerProps {
  open: boolean
  onClose: () => void
  onConfirm: (images: StockImageTypes[]) => void
  multiple?: boolean
}

export type StateTypes = {
  loading: boolean
  docs: StockImageTypes[]
  selected: string[]
  uploadqueue: File[]
}

export interface SPContextTypes extends Pick<StockPickerProps, 'multiple'> {
  control?: StockImageController
  state: StateTypes
  setState: Dispatch<SetStateAction<StateTypes>>
}

export const SPContext = createContext<SPContextTypes>({
  state: {
    loading: true,
    docs: [],
    selected: [],
    uploadqueue: []
  },
  setState: () => {}
})

export const useSP = () => useContext(SPContext)
