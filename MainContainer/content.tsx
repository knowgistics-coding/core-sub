
import { Box, styled, Theme } from '@mui/material'
import { useMC } from './ctx'
import { useCore } from '../context'

const LeftPad = styled(({ open, ...props }: { open?: boolean }) => (
  <div {...props} />
))(({ theme, open }: { open?: boolean; theme: Theme }) => ({
  paddingLeft: open ? theme.sidebarWidth : 0,
  transition: 'padding-left 0.25s'
}))

interface MCContentProps {
  children: React.ReactNode
}
export const MCContent = ({ children }: MCContentProps) => {
  const { dense, sidebar, disableSidebarPadding } = useMC()
  const { isMobile } = useCore()

  const getLeftSidebarOpen = (): boolean => {
    if (disableSidebarPadding) {
      return false
    } else {
      return Boolean(sidebar && !isMobile)
    }
  }

  return (
    <Box display={'flex'}>
      <LeftPad open={getLeftSidebarOpen()} />
      <Box flex={1} pt={dense ? 0 : 6} pb={dense ? 0 : 6}>
        {children}
      </Box>
    </Box>
  )
}
