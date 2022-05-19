import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Checkbox,
  Fab,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  styled
} from '@mui/material'
import React, { useState } from 'react'
import { useCore } from '../../context'
import { ShowTypes, usePE } from '../context'
import { Blocks } from './blocks'

const genKey = (): string => Math.round(Math.random() * 1000000).toString()

const FabStyled = styled(Fab)(({}) => ({
  // position: 'fixed',
  // right: theme.spacing(2),
  // bottom: theme.spacing(2),
  // zIndex: theme.zIndex.drawer - 1
}))

export const PEContentAddButton = () => {
  const { t } = useCore()
  const {
    state: { hideToolbar },
    setState,
    show,
    setData
  } = usePE()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleOpen = ({
    currentTarget
  }: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(currentTarget)
  }
  const handleClose = () => setAnchorEl(null)
  const handleAddContent = (type: ShowTypes) => () => {
    setData((d) => {
      const contents = [...(d.contents || [])].concat({ type, key: genKey() })
      return { ...d, contents }
    })
    setAnchorEl(null)
  }
  const handleHideToolbarToggle = () =>
    setState((s) => ({ ...s, hideToolbar: !s.hideToolbar }))

  return (
    <React.Fragment>
      <FabStyled onClick={handleOpen}>
        <FontAwesomeIcon icon={['fad', 'plus']} size='2x' />
      </FabStyled>
      <Menu
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
      >
        <List dense>
          {Blocks.filter((block) => show.includes(block.key)).map((block) => (
            <ListItemButton
              key={block.key}
              onClick={handleAddContent(block.key)}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={block.icon} />
              </ListItemIcon>
              <ListItemText primary={t(block.title)} />
            </ListItemButton>
          ))}
          <ListItemButton onClick={handleHideToolbarToggle}>
            <ListItemIcon>
              <Checkbox edge='start' size='small' checked={hideToolbar} />
            </ListItemIcon>
            <ListItemText primary={t('Hide Toolbar')} />
          </ListItemButton>
        </List>
      </Menu>
    </React.Fragment>
  )
}
