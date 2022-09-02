import {Grid} from '@mui/material'
import { useCore } from '../context'
import { MainContainer } from '../MainContainer'
import { WebPageEditContext, WebPageEditProps } from './context'
import { WebPESidebar } from './sidebar'

export * from './types'

export const WebPageEdit = (props: WebPageEditProps) => {
  const { t } = useCore()

  return (
    <WebPageEditContext.Provider value={{ ...props, t }}>
      <MainContainer sidebar={<WebPESidebar />}>
        <Grid container spacing={1} {...props.GridContainerProps}></Grid>
      </MainContainer>
    </WebPageEditContext.Provider>
  )
}
