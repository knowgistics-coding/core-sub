import { Grid, GridProps, styled } from '@mui/material'


export type CardContainerProps = GridProps
export const CardContainer = styled((props: CardContainerProps) => (
  <Grid container spacing={2} {...props} />
))({})
