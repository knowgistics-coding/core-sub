import { ShowTypes } from '../context'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

export const Blocks: { title: string; icon: IconProp; key: ShowTypes }[] = [
  { title: 'Heading', icon: ['far', 'heading'], key: 'heading' },
  { title: 'Paragraph', icon: ['far', 'paragraph'], key: 'paragraph' },
  { title: 'Image', icon: ['far', 'image'], key: 'image' },
  { title: 'Video', icon: ['far', 'video'], key: 'video' },
  { title: 'Cover', icon: ['far', 'image'], key: 'cover' },
  { title: 'Slide', icon: ['far', 'images'], key: 'slide' },
  { title: 'Highlight', icon: ['far', 'newspaper'], key: 'highlight' },
  { title: 'Card', icon: ['far', 'table'], key: 'card' },
  { title: 'Table', icon: ['far', 'table'], key: 'table' },
  { title: 'Divider', icon: ['far', 'horizontal-rule'], key: 'divider' },
  { title: 'File', icon: ['far', 'file-alt'], key: 'file' }
]
