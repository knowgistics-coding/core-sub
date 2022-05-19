import { createContext, useContext } from 'react'
import { ImageDataMongoTypes } from '../skeleton.controller'
import { ImagePickerController } from './ctl'

export const defaultState = {
  loading: true,
  uploading: false,
  docs: [],
  files: [],
  progress: {},
  selected: [],
  open: {}
}

export interface IMPContextTypes {
  controller: ImagePickerController | null
  multiple: boolean
  state: {
    loading: boolean
    uploading: boolean
    docs: ImageDataMongoTypes[]
    files: File[]
    progress: { [key: number]: number }
    selected: string[]
    open: { [key: string]: boolean }
  }
  setState: React.Dispatch<React.SetStateAction<IMPContextTypes['state']>>
}
export const IMPContext = createContext<IMPContextTypes>({
  controller: new ImagePickerController(null, null),
  multiple: false,
  state: defaultState,
  setState: () => defaultState
})

export const useIMP = () => useContext(IMPContext)
