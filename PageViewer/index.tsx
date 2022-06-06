import React, { Fragment } from 'react'
import { MainContainer, MainContainerProps } from '../MainContainer'
import { PageViewerContext, PageViewerProps } from './context'
import { ContentHeader } from '../ContentHeader'
import { Container } from '../Container'
import { StockDisplay } from '../StockDisplay'
import { Box, Button, Typography } from '@mui/material'
import { Paragraph } from '../ParagraphString'
import { VideoDisplay } from '../VideoDisplay'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import {
  SlideContainer,
  SlideItem,
  SlideItemContent,
  SlideItemFeature
} from '../Slide'
import { useCore } from '../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ShowTypes } from '../PageEdit/context'
import moment from 'moment'

const PageContainer = ({
  children,
  noContainer,
  mainContainerProps
}: {
  children: React.ReactNode
  noContainer?: boolean
  mainContainerProps?: Omit<MainContainerProps, 'children'>
}) =>
  noContainer ? (
    <Fragment>{children}</Fragment>
  ) : (
    <MainContainer dense {...mainContainerProps}>
      {children}
    </MainContainer>
  )

export const PageViewer = (props: PageViewerProps) => {
  const { t, isMobile } = useCore()
  const data = props.data

  return (
    <PageViewerContext.Provider value={{ ...props }}>
      <PageContainer
        noContainer={props.noContainer}
        mainContainerProps={props.mainContainerProps}
      >
        {data.feature && <StockDisplay {...data.feature} ratio={1 / 4} />}
        <Box py={6}>
          <Container maxWidth={props.maxWidth || 'post'}>
            {data.title && (
              <ContentHeader
                label={data.title}
                breadcrumbs={props.breadcrumbs}
                secondary={data.datemodified ? <>
                <FontAwesomeIcon icon={["far","calendar"]} style={{marginRight:'0.5rem'}} />
                {moment(data.datemodified).format("LL")}
                <Box display="inline-block" sx={{px:1}}>|</Box>
                <FontAwesomeIcon icon={["far","clock"]} style={{marginRight:'0.5rem'}} />
                {moment(data.datemodified).format("LT")}
                </> : undefined}
              />
            )}
          </Container>
          {data?.contents?.map((content) => {
            const Wrapper = ({ children }: { children: React.ReactNode }) =>
              (
                [
                  'heading',
                  'paragraph',
                  'file',
                  'image',
                  'table',
                  'video'
                ] as ShowTypes[]
              ).includes(content.type) ? (
                <Container
                  maxWidth={props.maxWidth || 'post'}
                  key={content.key}
                >
                  <Box pt={content?.mt} pb={content?.mb}>
                    {children}
                  </Box>
                </Container>
              ) : (
                <Box pt={content?.mt} pb={content?.mb}>
                  {children}
                </Box>
              )
            switch (content.type) {
              case 'heading':
                return (
                  <Wrapper key={content.key}>
                    <Paragraph
                      dense
                      view
                      value={content?.heading?.value}
                      editorProps={{ toolbarHidden: true, readOnly: true }}
                      align={content.heading?.align}
                      variant={content?.heading?.variant || 'h5'}
                      color="textPrimary"
                    />
                  </Wrapper>
                )
              case 'paragraph':
                return (
                  <Wrapper key={content.key}>
                    <Paragraph
                      dense
                      view
                      value={content?.paragraph?.value}
                      editorProps={{ toolbarHidden: true, readOnly: true }}
                      color="textSecondary"
                    />
                  </Wrapper>
                )
              case 'image':
                return (
                  <Wrapper key={content.key}>
                    <StockDisplay size="large" {...content?.image} />
                  </Wrapper>
                )
              case 'video':
                return (
                  <Wrapper key={content.key}>
                    <VideoDisplay content={content?.video} />
                  </Wrapper>
                )
              case 'table':
                if (content.table) {
                  return (
                    <Wrapper key={content.key}>
                      <DataGrid
                        rows={content.table.rows}
                        columns={
                          content.table.columns.map((column) => ({
                            ...column,
                            sortable: false
                          })) as GridColumns
                        }
                        disableColumnMenu
                        disableSelectionOnClick
                        hideFooter
                        autoHeight
                        sx={{
                          "& .MuiDataGrid-columnHeaderTitle": {
                            typography: 'body1',
                            fontWeight: "bold",
                          },
                          "& .MuiDataGrid-cellContent": {
                            color: 'text.secondary'
                          }
                        }}
                      />
                    </Wrapper>
                  )
                } else {
                  return null
                }
              case 'slide':
                return (
                  <Wrapper key={content.key}>
                    <SlideContainer>
                      {content.slide?.map((slide, sindex) => (
                        <SlideItem key={sindex}>
                          <SlideItemFeature {...slide.feature} />
                          <SlideItemContent>
                            <Typography variant='h3' paragraph>
                              {slide.title}
                            </Typography>
                            <Button
                              variant='outlined'
                              color='light'
                              startIcon={
                                <FontAwesomeIcon icon={['fad', 'link']} />
                              }
                            >
                              {t('Open')}
                            </Button>
                          </SlideItemContent>
                        </SlideItem>
                      ))}
                    </SlideContainer>
                  </Wrapper>
                )
              case 'cover':
                return (
                  <Wrapper key={content.key}>
                    <StockDisplay
                      {...content.cover}
                      ratio={isMobile ? 1 : 1 / 4}
                    />
                  </Wrapper>
                )
              default:
                return process.env.NODE_ENV === 'development' ? (
                  <pre key={content.key}>
                    {JSON.stringify(content, null, 2)}
                  </pre>
                ) : null
            }
          })}
          <Container maxWidth={props.maxWidth}>{props.children}</Container>
        </Box>
      </PageContainer>
    </PageViewerContext.Provider>
  )
}
