
import update from 'react-addons-update'
import { Paragraph } from '../../ParagraphString'
import { useCE } from '../ctx'
import { paragraphTypes } from '../ctx.d'
import { CEPanel } from './panel'

export interface CEParagraphPanelProps {
  content: paragraphTypes
  index: number
}

export const CEParagraphPanel = ({ content, index }: CEParagraphPanelProps) => {
  const {
    state: { focus },
    setData,
    setState
  } = useCE()

  const handleChange = (value: string) => {
    setData((d) =>
      update(d, { contents: { [index]: { value: { $set: value } } } })
    )
  }
  const handleFocus = () => {
    setState((s) => ({ ...s, focus: content.key }))
  }
  const handleBlur = () => {
    setState((s) => ({ ...s, focus: null }))
  }

  return (
    <CEPanel maxWidth='post' contentKey={content.key} index={index}>
      <Paragraph
        value={content.value}
        onChangeHTML={handleChange}
        editorProps={{
          toolbarHidden: !Boolean(focus === content.key),
          onFocus: handleFocus,
          onBlur: handleBlur
        }}
      />
    </CEPanel>
  )
}
