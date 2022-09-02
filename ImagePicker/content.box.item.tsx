import { Box, BoxProps, Grid, styled } from "@mui/material"

const sizes = { xs: 4, sm: 4, md: 3 }

export const BoxItem = styled(({ children, ...props }: BoxProps) => {
  return (
    <Grid item {...sizes}>
      <Box {...props}>{children}</Box>
    </Grid>
  )
})(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.grey[500],
  '&:before': {
    content: "''",
    display: 'block',
    paddingTop: '100%'
  },
  '&>div': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  '&>.center': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))