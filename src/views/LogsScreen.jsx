import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { startChangePage, startGetErrorLogs } from 'src/slices/log';
import { Button, MenuItem, Modal, Select, TablePagination, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { Filter } from 'react-feather';
import { KeyboardDatePicker } from '@material-ui/pickers';
import useAuth from 'src/contextapi/hooks/useAuth';
import { Redirect } from 'react-router';

const items = [
  { value: 'all', label: 'Todos' },
  { value: 'oportunidadId', label: 'Oportunidad ID' },
  { value: 'vendedorId', label: 'Cédula Asesor' },
  { value: 'clienteId', label: 'Cédula Cliente' },
  { value: 'fondoId', label: 'Fondo' },
  { value: 'created_at', label: 'Fecha de creación' },
];

const columns = ['Petición', 'Respuesta', 'Oportunidad ID', 'Cédula Cliente', 'Fondo', 'Fecha de Creación']

const LogsScreen = () => {
  const { isAuthenticated, role } = useAuth();
  const dispatch = useDispatch();
  const { errorLogs, isLoading, error } = useSelector(state => state.log);
  const [modalData, setModalData] = useState({});
  const [filterBy, setFilterBy] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(startGetErrorLogs());
  }, []);

  console.log(role);

  if(!isAuthenticated || role !== 'admin') {
    return <Redirect to={'/'} />
  }

  if (isLoading) {
    return <div />;
  }

  const handlePageChange = (_, value) => {
    let url = `${errorLogs.path}?`;
    if(filterBy === 'all' || filterValue === '') {
      url = url + `page=${value + 1}`;
    }else {
      url = url + `${filterBy}=${filterValue}&page=${value + 1}`;
    }
    dispatch(startChangePage(url));
  }

  const handleModalValue = (data) => {
    setModalData(data);
    setOpen(true);
  }

  const switchFilterBy = () => {
    switch (filterBy) {
      case 'oportunidadId':
        return 'Oportunidad ID';
      case 'vendedorId':
        return 'Cédula del Asesor';
      case 'created_at':
        return 'Fecha de Creación';
      case 'clienteId':
        return 'Cédula del Cliente';
      default:
        return 'Oportunidad ID';
    }
  }

  console.log(filterBy);

  return (
    <View>
      <div
        style={{
          width: '100%',
          backgroundColor: '#012f83',
          height: '',
          padding: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <img
          src="/static/logos/genesis_logo_blue.svg"
          alt="Genesis Logo"
          style={{
            height: '3rem',
            marginLeft: '1em'
          }}
        />
      </div>
      <Typography
        className='title'
        variant='h1'
      >Tabla de Auditorías</Typography>

      <div className='table filter-container'>
        <Select defaultChecked='all' value={filterBy} onChange={({ target }) => {
          if(target.value === 'created_at') {
            setFilterValue(new Date());
          }else {
            setFilterValue('');
          }
          setFilterBy(target.value);
        }} variant='outlined'>
          {
            items.map(({ value, label }) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))
          }
        </Select>

        {
          filterBy === 'created_at' ?
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy-MM-DD"
              style={{ marginTop: '.5rem' }}
              margin="none"
              id="date-picker-inline"
              label="Fecha de Creación del registro"
              value={filterValue}
              onChange={(_, value) =>  setFilterValue(value)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            :

            filterBy !== 'all' &&
            
            <TextField
              id="outlined-basic"
              label={switchFilterBy()}
              variant="outlined"
              onChange={({ target }) => setFilterValue(target.value)}
              value={filterValue}
            />
        }
        <Button
          variant="contained"
          color="primary"
          className='btn-filter'
          onClick={() => {
            handlePageChange(null, 0);
            // dispatch(startGetErrorLogs({ [filterBy]: filterValue }));
          }}
        >Filtrar
          <Filter />
        </Button>
      </div>

      <TableContainer component={Paper}
        className='table'
      >
        <Table aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              {
                columns.map((label) => (
                  <TableCell
                    key={label}
                    align={'center'}
                  >{label}</TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {errorLogs.data.map(({ json_value, json_response, created_at, oportunidadId, clienteId, fondoId }, i) => (
              <TableRow key={i}>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleModalValue(json_value)}
                  >Ver Json de Petición</Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleModalValue(json_response)}
                  >Ver Json de Respuesta</Button>
                </TableCell>
                <TableCell align="center">{oportunidadId}</TableCell>
                <TableCell align="center">{clienteId}</TableCell>
                <TableCell align="center">{fondoId}</TableCell>
                <TableCell align="center">{created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={errorLogs.total}
        rowsPerPage={errorLogs.per_page}
        page={errorLogs.current_page - 1}
        onPageChange={() => console.log('hola')}
        // onRowsPerPageChange={handleChangeRowsPerPage}
        onChangePage={handlePageChange}
        className='pagination'
      />

      <Modal
        open={open}
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        onClose={() => setOpen(false)}
      >
        <pre
          style={{
            padding: '1rem',
            overflowY: 'auto',
            maxHeight: '80vh',
            backgroundColor: 'white',
            margin: 'auto',
          }}
        >{JSON.stringify(modalData, null, 2)}</pre>
      </Modal>
    </View>
  )
}

const View = styled.div`
  height: 100%;
  overflow: auto;
  padding-bottom: 2rem;

  .title {
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .pagination {
    .MuiTablePagination-input {
      display: none;
    }
    .MuiTablePagination-toolbar{
      width: 90%;
    }
  }

  .table {
    max-width: 1200px;
    width: 90%;
    margin: 0 auto;
  }

  .filter-container {
    gap: 1rem;
    margin-bottom: 2rem;
    display: flex;
  }

  .modal-content{
    background-color: #fff;
  }
`;

export default LogsScreen