import { GridCellEditCommitParams } from '@mui/x-data-grid'
import update from 'react-addons-update'
import { PageDocument } from '../../context'

export const commitCalc = (
  index: number,
  data: PageDocument,
  { id, field, value }: GridCellEditCommitParams
): PageDocument => {
  if (data.contents?.[index].table?.rows) {
    const rowIndex = data.contents[index].table?.rows?.findIndex(
      (row) => row.id === id
    )
    if (typeof rowIndex === 'number') {
      return update(data, {
        contents: {
          [index]: {
            table: { rows: { [rowIndex]: { $merge: { [field]: value } } } }
          }
        }
      })
    }
  }
  return data
}

export const changeColumnHeaderName = (
  index: number,
  colIndex: number,
  value: string,
  data: PageDocument
): PageDocument => {
  if (data.contents?.[index]?.table?.columns) {
    const newTable = update(data, {
      contents: {
        [index]: {
          table: {
            columns: {
              [colIndex]: {
                headerName: {
                  $set: value
                }
              }
            }
          }
        }
      }
    })
    return newTable
  }
  return data
}

export const changeColumnWidth = (
  index: number,
  colIndex: number,
  value: string,
  data: PageDocument
): PageDocument => {
  if (data.contents?.[index]?.table?.columns) {
    const newTable = update(data, {
      contents: {
        [index]: {
          table: {
            columns: {
              [colIndex]: {
                width: {
                  $set: parseInt(value)
                }
              }
            }
          }
        }
      }
    })
    return newTable
  }
  return data
}
