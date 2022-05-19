
import { DataGrid as DG, DataGridProps as DGP } from '@mui/x-data-grid'
import { useCore } from '../context'

export interface DataGridProps extends Omit<DGP, 'autoHeight'> {}
export const DataGrid = (props: DataGridProps) => {
  const { t } = useCore()

  /**
   * LOCALE
   * https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts
   */
  return (
    <DG
      autoHeight
      localeText={{
        noRowsLabel: t('No rows'),
        columnMenuShowColumns: t('Show columns'),
        columnMenuFilter: t('Filter'),
        columnMenuHideColumn: t('Hide'),
        columnMenuUnsort: t('Unsort'),
        columnMenuSortAsc: t('Sort by ASC'),
        columnMenuSortDesc: t('Sort by DESC')
      }}
      {...props}
    />
  )
}
