import { RawDraftContentState } from 'draft-js'
import { variants } from '../HeaderEditor/variant.setting'
import { ImageDisplayProps } from '../ImageDisplay'

interface defaultTypes {
  key: string
  top?: number
  bottom?: number
}

export interface headingTypes extends defaultTypes {
  type: 'heading'
  value?: string
  variant?: variants
  align?: 'left' | 'center' | 'right'
}

export interface paragraphTypes extends defaultTypes {
  type: 'paragraph'
  value?: RawDraftContentState
}

export interface imageTypes extends defaultTypes {
  type: 'image'
  value?: ImageDisplayProps & {
    blurhash?: string
    id?: string
    medium?: string
    original?: string
    thumbnail?: string
  }
  pos?: {
    left: number
    top: number
  }
  ratio?: { height: string; width: string }
}

interface coverTypes extends defaultTypes {
  type: 'cover'
  value?: ImageDisplayProps
}

/** NOT CREATE YET */
interface cardTypes extends defaultTypes {
  type: 'card'
}

interface highlightTypes extends defaultTypes {
  type: 'highlight'
  values?: {
    title: string
    cover: ImageDisplayProps
    id: string
    variant?: 'left' | 'right' | 'full'
  }[]
}

interface slideTypes extends defaultTypes {
  type: 'slide'
  values?: {
    title: string
    cover: ImageDisplayProps
    id: string
  }[]
}

interface bookTypes extends defaultTypes {
  type: 'book'
  value?: {
    title: string
    cover: ImageDisplayProps
    id: string
  }
}

export interface vdoTypes extends defaultTypes {
  type: 'vdo'
  value?: string
  from?: 'link' | 'facebook' | 'youtube'
}

interface tableParagraphTypes {
  type: 'paragraph'
  value?: RawDraftContentState
}

interface tableNumberTypes {
  type: 'paragraph'
  value?: number
}

interface tableImageTypes {
  type: 'image'
  value?: ImageDisplayProps['image']
}

export interface tableTypes extends defaultTypes {
  type: 'table'
  columns: { key: string }[]
  rows: { key: string }[]
  values: {
    [key: string]: tableParagraphTypes | tableNumberTypes | tableImageTypes
  }[]
}

export interface fileTypes extends defaultTypes {
  type: 'file'
  value?: {
    ext: string
    mime: string
    name: string
    size: number
    user: string
    original: string
  }
}

export interface dividerTypes extends defaultTypes {
  type: 'divider'
}

export type ContentTypes =
  | headingTypes
  | paragraphTypes
  | imageTypes
  | coverTypes
  | cardTypes
  | highlightTypes
  | slideTypes
  | bookTypes
  | vdoTypes
  | tableTypes
  | fileTypes
  | dividerTypes
