import { Box } from '@mui/material'


export const SlideItemContent = (props: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box textAlign={"center"}>{props.children}</Box>
    </Box>
  )
}
