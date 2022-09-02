import { Box, BoxProps, CircularProgress, styled } from '@mui/material'


export const MCLoading = styled((props: BoxProps) => (
  <Box {...props}>
    <CircularProgress />
  </Box>
))(({ theme }) => ({
  padding: theme.spacing(6, 0),
  textAlign: 'center'
}))
