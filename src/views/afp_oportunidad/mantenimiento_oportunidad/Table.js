import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link as RouterLink } from 'react-router-dom';
import {Link,Button, Box} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import RemoveIcon from '@material-ui/icons/Remove';
import { useSelector, useDispatch } from 'src/store';
import {getFondoAporteDelete} from 'src/slices/clientes';
import {getFondoAporteEdit} from 'src/slices/clientes';



const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);



const useStyles = makeStyles({
  table: {
    minWidth: 700,
    maxWidth:1500,
  },
});




export default function TableGet({FondoAportes}) {
  const classes = useStyles();
  const identification = useSelector((state) => state.cliente.StepCharge.numero_identificacion);
  const dispatch = useDispatch();



  function handleDeleteAporte(id_cliente){
    dispatch(getFondoAporteDelete(id_cliente, identification));
  }

   function handleEditAporte(id_cliente){
    dispatch(getFondoAporteEdit(id_cliente));
  }


  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell align="right">MONTO</StyledTableCell>
            <StyledTableCell align="right">FECHA CREACIÓN</StyledTableCell>
            <StyledTableCell align="right">ACCIONES</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {FondoAportes && FondoAportes.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.idClienteAporte}
              </StyledTableCell>
              <StyledTableCell align="right">{row.monto_aporte}</StyledTableCell>
              <StyledTableCell align="right">{row.fecha_inicio_aporte}</StyledTableCell>
              <StyledTableCell align="right">

              <Link to="/afp/crm/oportunidad/editar/registrooportunidad" component={RouterLink}>
                <Button onClick={() => handleEditAporte(row.idClienteAporte)} size="small" variant="contained" style={{background:'black', color:'white'}}
                  startIcon={<EditIcon />}
                >
                  EDITAR
                </Button>
              </Link>

              <Button size="small" onClick={() => handleDeleteAporte(row.idClienteAporte)} variant="contained" style={{background:'black', color:'white'}}
                  startIcon={<RemoveIcon/>}
                >
                  ELIMINAR
                </Button>

              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
