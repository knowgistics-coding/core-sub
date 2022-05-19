import { ShowTypes } from '../context'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

export const Blocks: { title: string; icon: IconProp; key: ShowTypes }[] = [
  { title: 'Heading', icon: ['fad', 'heading'], key: 'heading' },
  { title: 'Paragraph', icon: ['fad', 'paragraph'], key: 'paragraph' },
  { title: 'Image', icon: ['fad', 'image'], key: 'image' },
  { title: 'Video', icon: ['fad', 'video'], key: 'video' },
  { title: 'Cover', icon: ['fad', 'image'], key: 'cover' },
  { title: 'Slide', icon: ['fad', 'images'], key: 'slide' },
  { title: 'Highlight', icon: ['fad', 'newspaper'], key: 'highlight' },
  { title: 'Card', icon: ['fad', 'table'], key: 'card' },
  { title: 'Table', icon: ['fad', 'table'], key: 'table' },
  { title: 'Divider', icon: ['fad', 'horizontal-rule'], key: 'divider' },
  { title: 'File', icon: ['fad', 'file-alt'], key: 'file' }
]
