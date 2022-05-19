
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { usePE } from '../context'
import { useCore } from '../../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { arrayMoveImmutable } from 'array-move'
import update from 'react-addons-update'
import {Fragment} from 'react'

interface PanelMoveProps {
  index: number
  onClose: () => void
}
export const PanelMove = ({ index, onClose }: PanelMoveProps): JSX.Element => {
  const { t } = useCore()
  const {
    data: { contents },
    setData
  } = usePE()

  const handleMoveUp = () => {
    if (index > 0 && contents) {
      const newContents = arrayMoveImmutable(contents, index, index - 1)
      setData((d) => update(d, { contents: { $set: newContents } }))
    }
    onClose()
  }
  const handleMoveDown = () => {
    if (contents?.length && index + 1 < contents?.length && contents) {
      const newContents = arrayMoveImmutable(contents, index, index + 1)
      setData((d) => update(d, { contents: { $set: newContents } }))
    }
    onClose()
  }

  const MoveUp = () => (
    <ListItemButton onClick={handleMoveUp}>
      <ListItemIcon>
        <FontAwesomeIcon icon={['fad', 'chevron-up']} />
      </ListItemIcon>
      <ListItemText primary={t('Move Up')} />
    </ListItemButton>
  )
  const MoveDown = () => (
    <ListItemButton onClick={handleMoveDown}>
      <ListItemIcon>
        <FontAwesomeIcon icon={['fad', 'chevron-down']} />
      </ListItemIcon>
      <ListItemText primary={t('Move Down')} />
    </ListItemButton>
  )

  return (
    <Fragment>
      {index > 0 && <MoveUp />}
      {contents?.length && index + 1 < contents?.length && <MoveDown />}
    </Fragment>
  )
}
