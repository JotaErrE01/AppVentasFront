import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { DEFAULT_LOCALE_TEXT } from 'src/utils/localeText';
import { Loader } from 'react-feather';
import LoadingScreen from 'src/components/LoadingScreen';
import LoadBounce from 'src/components/common/LoadBounce';
import LoadSpinner from 'src/components/LoadSpinner';
import LoadingFull from 'src/components/LoadingFull';
import JSONTree from 'react-json-tree';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';

const columns = [
  { field: 'id', headerName: 'id', hide: true },
  {
    field: 'periodo',
    width: 120,
    renderHeader: () => <h4>PERIODO</h4>,
  },
  {
    field: 'enviado',
    type: 'number',
    width: 120,
    renderHeader: () => (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ lineHeight: '.9em', fontWeight: '600' }}>ENVIADOS</span>
        <span style={{ lineHeight: '.9em', fontWeight: '600' }}>A FIRMAR</span>
      </div>
    ),
  },
  {
    field: 'firmado',
    type: 'number',
    width: 120,
    renderHeader: () => <h4>FIRMADOS</h4>,
  },
];




const sumData = (data) => {

  let enviados = 0;
  data.forEach(data => {
    return enviados += parseInt(data.enviado)
  });


  let firmados = 0;
  data.forEach(data => {
    return firmados += parseInt(data.firmado)
  });


  return { enviados, firmados }
}

const GridTable = ({ data }) => {
  const { enviados, firmados } = sumData(data)
  return (
    <>
      <div style={{ width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={12}
          rowsPerPageOptions={[12]}
          localeText={DEFAULT_LOCALE_TEXT}
          autoHeight
        />
      </div>
      <TableRow style={{ width: '100%' }}>
        <TableCell style={{ width: "13em" }}>
          <h4>TOTAL</h4>
        </TableCell>
        <TableCell style={{ width: "10em" }}>
          <h4>{enviados}</h4>
        </TableCell>
        <TableCell style={{ width: "10em" }}>
          <h4> {firmados}</h4>
        </TableCell>
      </TableRow>

    </>
  );
};

export default GridTable;