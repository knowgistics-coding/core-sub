
import { CEFilePanel } from './content/panel.file'
import { CEHeadingPanel } from './content/panel.heading'
import { CEImagePanel } from './content/panel.image'
import { CEParagraphPanel } from './content/panel.paragraph'
import { CEVdoPanel } from './content/panel.vdo'
import { useCE } from './ctx'

import { PanelContainer } from './content/panel.container'
import { SortEnd } from 'react-sortable-hoc'
import update from 'react-addons-update'

export const CEContent = () => {
  const { data, setData } = useCE()

  const handleSortEnd = ({ newIndex, oldIndex }: SortEnd) => {
    if (newIndex !== oldIndex) {
      const [newContent, oldContent] = [
        data?.contents?.[newIndex],
        data?.contents?.[oldIndex]
      ]
      setData((d) =>
        update(d, {
          contents: {
            [newIndex]: { $set: oldContent },
            [oldIndex]: { $set: newContent }
          }
        })
      )
    }
  }

  return (
    <PanelContainer onSortEnd={handleSortEnd} useDragHandle>
      {data.contents?.map((content, index) => {
        switch (content.type) {
          case 'heading':
            return (
              <CEHeadingPanel
                content={content}
                key={content.key}
                index={index}
              />
            )
          case 'paragraph':
            return (
              <CEParagraphPanel
                content={content}
                key={content.key}
                index={index}
              />
            )
          case 'image':
            return (
              <CEImagePanel content={content} key={content.key} index={index} />
            )
          case 'vdo':
            return (
              <CEVdoPanel content={content} key={content.key} index={index} />
            )
          case 'file':
            return (
              <CEFilePanel content={content} index={index} key={content.key} />
            )
          default:
            console.log(content)
            return null
        }
      })}
    </PanelContainer>
  )
}
