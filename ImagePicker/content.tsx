import { Checkbox, Grid, styled } from '@mui/material'

import { useIMP } from './ctx'
import { Loading } from './content.loading'
import { PercentBox } from './content.percent.box'
import { NoImageBox } from './content.no.image'
import { BoxItem } from './content.box.item'
import { ImageDataMongoTypes } from '../skeleton.controller'
import { ImageDisplay, ImageDisplayProps } from '../ImageDisplay'
import update from 'react-addons-update'

const CheckStyled = styled(Checkbox)({ position: 'absolute', right: 0, top: 0 })

const ImageBox = ({
  doc,
  selected,
  onCheck
}: {
  doc: ImageDataMongoTypes
  selected?: boolean
  onCheck: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void
}) => {
  const image: ImageDisplayProps['image'] = {
    blurhash: doc.blurhash,
    thumbnail: doc.content.thumbnail,
    original: doc.content.original,
    id: doc._id
  }
  return (
    <BoxItem>
      <div>
        <ImageDisplay image={image} ratio={1} hover />
        <CheckStyled checked={Boolean(selected)} onChange={onCheck} />
      </div>
    </BoxItem>
  )
}

export const IMPContent = () => {
  const { state, setState, multiple } = useIMP()

  const handleCheck =
    (id: string) =>
    (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (multiple) {
        if (checked) {
          setState((s) => ({
            ...s,
            selected: s.selected.concat(id)
          }))
        } else {
          setState((s) => ({
            ...s,
            selected: s.selected.filter((s) => s !== id)
          }))
        }
      } else {
        if (checked) {
          setState((s) => update(s, { selected: { $set: [id] } }))
        } else {
          setState((s) => update(s, { selected: { $set: [] } }))
        }
      }
    }

  return (
    <div>
      <Grid container spacing={1}>
        {state.files.map((file) => (
          <PercentBox
            value={state.progress?.[file.size]}
            file={file}
            key={file.size}
          />
        ))}
        {state.loading ? (
          <Loading />
        ) : state.docs.length ? (
          state.docs.map((doc) => (
            <ImageBox
              doc={doc}
              selected={state.selected.includes(doc._id)}
              onCheck={handleCheck(doc._id)}
              key={doc._id}
            />
          ))
        ) : (
          <NoImageBox />
        )}
      </Grid>
    </div>
  )
}
