
import update from 'react-addons-update'
import { HeaderEditor } from '../../HeaderEditor'
import { useCE } from '../ctx'
import { headingTypes } from '../ctx.d'
import { CEPanel } from './panel'

export const CEHeadingPanel = ({
  content,
  index
}: {
  content: headingTypes
  index: number
}) => {
  const {
    state: { focus },
    setState,
    data,
    setData
  } = useCE()

  const handleFocus = (focusing: boolean) => () =>
    setState((s) => ({ ...s, focus: focusing ? content.key : null }))
  const handleChange = (htmlValue: string) => {
    if (data.contents) {
      const index = data.contents.findIndex((doc) => doc.key === content.key)
      setData((d) =>
        update(d, { contents: { [index]: { value: { $set: htmlValue } } } })
      )
    }
  }
  const handleChangeOption = (key: string, value: any) => {
    if (data.contents) {
      const index = data.contents.findIndex((doc) => doc.key === content.key)
      setData((d) =>
        update(d, { contents: { [index]: { [key]: { $set: value } } } })
      )
    }
  }

  return (
    <CEPanel maxWidth='sm' contentKey={content.key} index={index}>
      <HeaderEditor
        editorProps={{
          toolbarHidden: focus !== content.key,
          onFocus: handleFocus(true),
          onBlur: handleFocus(false)
        }}
        value={content.value}
        onChange={handleChange}
        variant={content.variant}
        onChangeOption={handleChangeOption}
      />
    </CEPanel>
  )
}
