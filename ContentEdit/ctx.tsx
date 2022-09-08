import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { ContentHeaderProps } from '../ContentHeader'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { ContentTypes } from './ctx.d'
import { StockDisplayProps } from '../StockDisplay'

export type showTypes =
  | 'title'
  | 'feature'
  | 'heading'
  | 'paragraph'
  | 'vdo'
  | 'highlight'
  | 'image'
  | 'cover'
  | 'slide'
  | 'book'
  | 'card'
  | 'table'
  | 'file'
  | 'divider'
  | 'visibility'

export const contentLists: {
  label: string
  icon: IconProp
  id: showTypes
}[] = [
  { label: 'Heading', icon: ['fad', 'heading'], id: 'heading' },
  { label: 'Paragraph', icon: ['fad', 'paragraph'], id: 'paragraph' },
  { label: 'Image', icon: ['fad', 'image'], id: 'image' },
  { label: 'Cover', icon: ['fad', 'image'], id: 'cover' },
  { label: 'Card', icon: ['fad', 'table'], id: 'card' },
  { label: 'Highlight', icon: ['fad', 'newspaper'], id: 'highlight' },
  { label: 'Slide', icon: ['fad', 'images'], id: 'slide' },
  { label: 'Book', icon: ['fad', 'book'], id: 'book' },
  { label: 'Video', icon: ['fad', 'video'], id: 'vdo' },
  { label: 'Table', icon: ['fad', 'table'], id: 'table' },
  { label: 'File', icon: ['fad', 'file-alt'], id: 'file' },
  { label: 'Divider', icon: ['fad', 'horizontal-rule'], id: 'divider' }
]

export interface dataTypes {
  title?: string
  cover?: StockDisplayProps
  contents?: ContentTypes[]
  visibility?: 'private' | 'public'
  user?: string
  type?: string
}

export interface ContentEditProps {
  loading?: boolean
  back?: string
  breadcrumbs?: ContentHeaderProps['breadcrumbs']
  data: dataTypes
  onSave: () => Promise<boolean>
  post?: boolean
  setData: React.Dispatch<React.SetStateAction<dataTypes>>
  show: showTypes[]
}

export interface StateTypes {
  focus: string | null
}

export interface CEContextType extends ContentEditProps {
  state: StateTypes
  setState: Dispatch<SetStateAction<StateTypes>>
  getContentIndex: (key: string) => number
}

export const CEContext = createContext<CEContextType>({
  loading: true,
  onSave: async () => false,
  data: {},
  setData: () => {},
  show: [],
  state: {
    focus: null
  },
  setState: () => {},
  getContentIndex: () => -1
})

export const useCE = () => useContext(CEContext)
