import { useEffect, useRef, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { convertFromRaw, EditorState, RawDraftContentState } from 'draft-js'
import { styled, Typography } from '@mui/material'
import { toolbar } from './toolbar'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'

const StyledEditor = styled(Editor)({
  backgroundColor: 'white',
  padding: '0 16px',
  border: '1px solid #F1F1F1',
  minHeight: '160px'
})

export const parseParagraph = (value?: RawDraftContentState) =>
  (value &&
    Array.isArray(value.blocks) &&
    value.blocks.map((block) => block.text).join(' \n')) ||
  ''

interface StateTypes {
  edit: boolean
  editorState?: EditorState
  contentState?: RawDraftContentState
}
export interface ParagraphProps {
  value?: RawDraftContentState | string
  onChange?: (value?: RawDraftContentState) => void
  onChangeHTML?: (value?: string) => void
  editable?: boolean
  editOnly?: boolean
}
export const Paragraph = ({
  value,
  onChange,
  onChangeHTML,
  editable,
  editOnly
}: ParagraphProps) => {
  const ref = useRef<Editor | null>(null)
  const [state, setState] = useState<StateTypes>({
    edit: false,
    editorState: undefined,
    contentState: undefined
  })

  const isReadOnly = (): boolean => {
    if (editOnly) {
      return false
    } else if (editable) {
      return !state.edit
    }
    return true
  }
  const handleEdit = () => {
    if (editable) {
      setState((s: StateTypes) => ({ ...s, edit: true }))
      if (ref.current) {
        ref.current?.focusEditor()
      }
    }
  }
  const handleEditorStateChange = (editorState: EditorState) =>
    setState((s: StateTypes) => ({ ...s, editorState }))
  const handleContentStateChange = (contentState: RawDraftContentState) =>
    setState((s: StateTypes) => ({ ...s, contentState }))
  const handleBlur = () => {
    if (editable) {
      setState((s: StateTypes) => ({ ...s, edit: false }))
      if (onChange) {
        onChange(state.contentState)
      }
      if (state.contentState) {
        onChangeHTML?.(draftToHtml(state.contentState))
      }
    }
  }

  useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
      } else {
        const editorState = EditorState.createWithContent(convertFromRaw(value))
        setState((s: StateTypes) => ({
          ...s,
          editorState,
          contentState: value
        }))
      }
    }
  }, [value])

  return (
    <div onClick={handleEdit}>
      <Typography variant='body1' component='div' color='textSecondary'>
        <StyledEditor
          ref={ref}
          toolbar={toolbar}
          editorState={state.editorState}
          stripPastedStyles
          onEditorStateChange={handleEditorStateChange}
          onContentStateChange={handleContentStateChange}
          toolbarHidden={isReadOnly()}
          readOnly={isReadOnly()}
          onBlur={handleBlur}
          placeholder='TypeHere'
        />
      </Typography>
    </div>
  )
}
