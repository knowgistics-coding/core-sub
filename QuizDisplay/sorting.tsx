import { Fragment, useEffect, useState } from 'react'
import { useQD } from './context'
import { SortableElement, SortableContainer, SortEnd } from 'react-sortable-hoc'
import { Box, Grid, GridProps } from '@mui/material'
import { ListButton } from './list.button'
import { QDParagraph } from './paragraph'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { dataTypes } from '../QuizEditor/context'
import { arrayShuffle } from '../func'
import { arrayMoveImmutable } from 'array-move'
import { QDImgDisplay } from '../QuizEditor/img'

const SortContainer = SortableContainer<GridProps>((props: GridProps) => (
  <Grid container spacing={1} {...props} />
))

const SortItem = SortableElement<GridProps>((props: GridProps) => (
  <Grid item xs={12} {...props} />
))

export const QDSorting = () => {
  const { quiz, setAnswer, onChange } = useQD()
  const [options, setOptions] = useState<dataTypes[]>([])

  const handleSortEnd = (data: SortEnd) => {
    const { oldIndex, newIndex } = data
    if (oldIndex !== newIndex) {
      const newOptions = arrayMoveImmutable(options, oldIndex, newIndex)
      const sorting = options.map((opt) => opt.key)
      setOptions(newOptions)
      setAnswer({ sorting })
      onChange({ sorting })
    }
  }

  useEffect(() => {
    if (quiz.type === 'sorting' && quiz.sorting?.options) {
      const options = arrayShuffle(quiz.sorting.options)
      const sorting = options.map((opt) => opt.key)
      setOptions(options)
      setAnswer({ sorting })
      onChange({ sorting })
    }
  }, [quiz])

  return (
    <Fragment>
      <SortContainer onSortEnd={handleSortEnd}>
        {options?.map((option, index) => (
          <SortItem index={index} key={option.key}>
            <ListButton
              label={(() => {
                switch (option.type) {
                  case 'image':
                    return option?.image?._id ? (
                      <Box>
                        <QDImgDisplay id={option.image._id} />
                      </Box>
                    ) : undefined
                  case 'paragraph':
                    return <QDParagraph value={option.paragraph} />
                  default:
                    return undefined
                }
              })()}
              icon={<FontAwesomeIcon icon={['fad', 'arrows']} />}
            />
          </SortItem>
        ))}
      </SortContainer>
    </Fragment>
  )
}
