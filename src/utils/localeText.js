export const DEFAULT_LOCALE_TEXT = {
    // Root
    rootGridLabel: 'grid',
    noRowsLabel: 'No rows',
    errorOverlayDefaultLabel: 'An error occurred.',
  
    // Density selector toolbar button text
    toolbarDensity: 'Density',
    toolbarDensityLabel: 'Density',
    toolbarDensityCompact: 'Compact',
    toolbarDensityStandard: 'Standard',
    toolbarDensityComfortable: 'Comfortable',
  
    // Columns selector toolbar button text
    toolbarColumns: 'Columnas',
    toolbarColumnsLabel: 'Show Column Selector',
  
    // Filters toolbar button text
    toolbarFilters: 'Filters',
    toolbarFiltersLabel: 'Show Filters',
    toolbarFiltersTooltipHide: 'Hide Filters',
    toolbarFiltersTooltipShow: 'Show Filters',
    toolbarFiltersTooltipActive: (count) => `${count} active filter(s)`,
  
    // Columns panel text
    columnsPanelTextFieldLabel: 'Find column',
    columnsPanelTextFieldPlaceholder: 'Column title',
    columnsPanelDragIconLabel: 'Reorder Column',
    columnsPanelShowAllButton: 'Mostrar todas',
    columnsPanelHideAllButton: 'Ocultar todas',
  
    // Filter panel text
    filterPanelAddFilter: 'Add Filter',
    filterPanelDeleteIconLabel: 'Delete',
    filterPanelOperators: 'Operators',
    filterPanelOperatorAnd: 'And',
    filterPanelOperatorOr: 'Or',
    filterPanelColumns: 'Columnas',
  
    // Filter operators text
    filterOperatorContains: 'contiene',
    filterOperatorEquals: 'igual que',
    filterOperatorStartsWith: 'starts with',
    filterOperatorEndsWith: 'ends with',
    filterOperatorIs: 'igual a',
    filterOperatorNot: 'no es igual',
    filterOperatorOnOrAfter: 'desde y después',
    filterOperatorBefore: 'antes',
    filterOperatorOnOrBefore: 'desde y antes de',
  
    // Column menu text
    columnMenuLabel: 'Menu',
    columnMenuShowColumns: 'Ocultar columnas',
    columnMenuFilter: 'Filtro',
    columnMenuHideColumn: 'Ocultar',
    columnMenuUnsort: 'Quitar orden',
    columnMenuSortAsc: '↑ Ascendente',
    columnMenuSortDesc: '↓ Descendente',
  
    // Column header text
    columnHeaderFiltersTooltipActive: (count) => `${count} active filter(s)`,
    columnHeaderFiltersLabel: 'Show Filters',
    columnHeaderSortIconLabel: 'Ordenar',
  
    // Rows selected footer text
    footerRowSelected: (count) =>
      count !== 1
        ? `${count.toLocaleString()} rows selected`
        : `${count.toLocaleString()} row selected`,
  
    // Total rows footer text
    footerTotalRows: 'Total Rows:',
  
    // Pagination footer text
    footerPaginationRowsPerPage: 'Rows per page:',
  };