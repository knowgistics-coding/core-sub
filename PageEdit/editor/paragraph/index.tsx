
import { Paragraph } from '../../../ParagraphString'
import { PEPanel } from '../../panel'
import { PEEditorProps } from '../heading'
import { PageContentTypes, usePE } from '../../context'
import update from 'react-addons-update'
import { genKey } from '../../genkey'
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const PEEditorParagraph = ({ index, content }: PEEditorProps) => {
  const {
    state: { focus },
    setState,
    setData
  } = usePE()

  const handleChange = (value: string) => {
    setData((d) =>
      update(d, { contents: { [index]: { paragraph: { $set: { value } } } } })
    )
  }
  const handleFocus = (value: boolean) => () =>
    setState((s) => ({ ...s, focus: value ? content.key : null }))
  const handleEnter = (paragraphs: string[]) => {
    const newParagraphs: PageContentTypes[] = paragraphs.map((value) => ({
      key: genKey(),
      type: 'paragraph',
      paragraph: { value }
    }))
    setData((d) =>
      update(d, {
        contents: {
          $apply: (contents: PageContentTypes[]) => {
            contents.splice(index, 1, ...newParagraphs)
            return contents
          }
        }
      })
    )
    setState((s) => ({
      ...s,
      focus: newParagraphs[newParagraphs.length - 1].key
    }))
  }
  const handleConvertToHeading = () => {
    const newContent: PageContentTypes = {
      key: content.key,
      type: 'heading',
      heading: {
        value: content.paragraph?.value
      }
    }
    setData((d) => update(d, { contents: { [index]: { $set: newContent } } }))
  }

  return (
    <PEPanel
      contentKey={content.key}
      content={content}
      index={index}
      actions={
        <ListItemButton onClick={handleConvertToHeading}>
          <ListItemIcon>
            <FontAwesomeIcon icon={['fad', 'retweet']} />
          </ListItemIcon>
          <ListItemText primary='Convert to Heading' />
        </ListItemButton>
      }
    >
      <Paragraph
        value={content.paragraph?.value}
        onChangeHTML={handleChange}
        editorProps={{
          toolbarHidden: !Boolean(focus === content.key),
          onFocus: handleFocus(true),
          onBlur: handleFocus(false)
        }}
        onEnter={handleEnter}
        dense
      />
    </PEPanel>
  )
}
