import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
    makeStyles,
    useTheme,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TablePagination,
    TableRow,
    Paper,
    Box,
    IconButton,
    Container,
    Link,
    Typography,
    Button,
    Card,
    Grid,
    colors,
    Avatar,
} from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import EditIcon from '@material-ui/icons/Edit';
import RemoveIcon from '@material-ui/icons/Remove';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { useDispatch, useSelector } from 'src/store';
import { getFondoAporteDelete } from 'src/slices/clientes';
import { getFondoAporteEdit } from 'src/slices/clientes';
import getInitials from 'src/utils/getInitials';
import { fondoCortoAndLargo } from 'src/slices/fondos';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#F2F2F2',
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    iconsPageControllers: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
    separateButtonAE: {
        marginTop: '.3em',
        marginBottom: '.3em',
        marginLeft: '.3em',
        marginRight: '.3em',
        background: 'black',
        color: 'white'
    },
    textIsNotData: {
        marginTop: '5em',
        marginLeft: '15em',
        marginRight: '15em',
        color: 'textPrimary'
    },
    ButtonBlack: {
        backgroundColor: '#000000',
        color: '#ffffff',
        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    },
    avatar: {
        backgroundColor: colors.green[500],
        color: colors.common.white
    },
}));

const TablePaginationActions = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.iconsPageControllers}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="Primera Pagina" >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="Pagina Anterior">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="Siguiente Pagina" >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="Ultima Pagina" >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
};

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const OportunidadesTerminadas = () => {
    const OportunidadesListado = useSelector((state) => state.cliente.OportunidadesListado);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const createData = (id_fondo, urlEditFondo, cliente_name, cliente_apellido, cliente_email, tipo_oportunidad, tipo_fondo, fecha_reg_oportunidad, fecha_rec_oportunidad, aporte_fondo ) => {
        return { id_fondo, urlEditFondo, cliente_name, cliente_apellido, cliente_email, tipo_oportunidad, tipo_fondo, fecha_reg_oportunidad, fecha_rec_oportunidad, aporte_fondo };
    };

    const rows = [];

    OportunidadesListado && OportunidadesListado.data.forEach(item => {
        var oportunidadCoL = '';
        var fondoContenido = '';
        var urlForC = '';
        if (item.fondo_id === '000001') {
            oportunidadCoL = 'LARGO PLAZO';
            fondoContenido = 'FONDO HORIZONTE';
            urlForC = 'largoPlazo';
        } else {
            oportunidadCoL = 'CORTO PLAZO';
            urlForC = 'cortoPlazo';
            if (item.fondo_id === '000029') {
                fondoContenido = 'FONDO MASTER';
            } else if (item.fondo_id === '000033') {
                fondoContenido = 'FONDO ESTRATEGICO';
            } else if (item.fondo_id === '000038') {
                fondoContenido = 'FONDO RENTAPLUS';
            } else if (item.fondo_id === '000040') {
                fondoContenido = 'FONDO SUPERIOR';
            };
        }

        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var fechaCreacion = new Date(item.created_at);
        var fechaRecepcion = new Date(item.updated_at);
        var fechaC = fechaCreacion.toLocaleDateString("es-ES", options);
        var fechaR = fechaRecepcion.toLocaleDateString("es-ES", options);

        if (item.cliente && item.aporte) {
            rows.push(createData(item.id, urlForC, item.cliente.primer_nombre, item.cliente.primer_apellido, item.cliente.email, oportunidadCoL, fondoContenido, fechaC, fechaR, item.aporte.monto_aporte));
        }
    });


    /* const handleDeleteAporte = (id_fondo, cod_ced_cliente) => {
        dispatch(getFondoAporteDelete(id_fondo, cod_ced_cliente));
    }; */

    const handleEditAporte = (id_fondo) => {
        dispatch(getFondoAporteEdit(id_fondo));
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const renderActions = (id_fondo, urlEditFondo) => {
        dispatch(fondoCortoAndLargo(urlEditFondo));
        return (
            <Fragment>
                <Link to={`/afp/crm/oportunidad/mantenimientoOportunidad/${urlEditFondo}`} component={RouterLink}>
                    <Button
                        className={classes.separateButtonAE}
                        onClick={() => handleEditAporte(id_fondo)}
                        size="small" variant="contained"
                        startIcon={<EditIcon />}
                    >
                        VER
                    </Button>
                </Link>

                {/* <Button
                    className={classes.separateButtonAE}
                    size="small"
                    onClick={() => handleDeleteAporte(id_fondo)}
                    variant="contained"
                    startIcon={<RemoveIcon/>}
                >
                    ELIMINAR
                </Button> */}
            </Fragment>
        );
    }

    return (
        // <Fragment className={classes.root}>
        <Fragment>
                            {(JSON.stringify(rows) == '[]') ? (
                                <Card>
                                    <Typography variant="body1" className={classes.textIsNotData} > Este usuario no tiene ninguna Oportunidad creada, para crear una de click aqui: </Typography>
                                    <Box mb={8} mt={3}>
                                        <Grid container>
                                            <Grid item md={12} xs={12} className={classes.separateButton}>
                                                <Grid container spacing={2}>
                                                    <Grid item md={4} xs={12} >
                                                    </Grid>
                                                    <Grid item md={4} xs={12} >
                                                        <Link style={{ textDecoration: 'none' }} to={'/afp/ventas'} component={RouterLink}>
                                                            <Button className={classes.ButtonBlack} fullWidth size="large" type="submit" variant="contained" >
                                                                Crear
                                                            </Button>
                                                        </Link>
                                                    </Grid>
                                                    <Grid item md={4} xs={12} >
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Card>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table className={classes.table} aria-label="custom pagination table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">ID</TableCell>
                                                <TableCell align="center">CLIENTE</TableCell>
                                                <TableCell align="center">TIPO</TableCell>
                                                <TableCell align="center">FONDO</TableCell>
                                                <TableCell align="center">APORTES</TableCell>
                                                <TableCell align="center">FECHA CREACIÓN</TableCell>
                                                <TableCell align="center">FECHA RECEPCIÓN</TableCell>
                                                <TableCell align="center">ACCIONES</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows ).map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell style={{ width: 100 }} align="left">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell style={{ width: 300 }} align="center">
                                                        <Box>
                                                            <Grid xs team container direction='row'>
                                                                <Box>
                                                                    <Avatar className={classes.avatar}>
                                                                        {getInitials(row.cliente_name)}
                                                                        {getInitials(row.cliente_apellido)}
                                                                    </Avatar>
                                                                </Box>
                                                                <Box ml={3}>
                                                                    <Typography>
                                                                        {row.cliente_name}
                                                                    </Typography>
                                                                    <Typography>
                                                                        {row.cliente_apellido}
                                                                    </Typography>
                                                                    <Typography color="textSecondary">
                                                                        {row.cliente_email}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="center">
                                                        {row.tipo_oportunidad}
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="center">
                                                        {row.tipo_fondo}
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="center">
                                                        {row.aporte_fondo}
                                                    </TableCell>
                                                    <TableCell style={{ width: 200 }} align="center">
                                                        {row.fecha_reg_oportunidad}
                                                    </TableCell>
                                                    <TableCell style={{ width: 200 }} align="center">
                                                        {row.fecha_rec_oportunidad}
                                                    </TableCell>
                                                    <TableCell style={{ width: 100 }} align="center">
                                                        {renderActions(row.id_fondo, row.urlEditFondo)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {emptyRows > 0 && (
                                                <TableRow style={{ height: 53 * emptyRows }}>
                                                    <TableCell colSpan={8} />
                                                </TableRow>
                                            )}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                                                    colSpan={8}
                                                    count={rows.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    SelectProps={{
                                                        inputProps: { 'aria-label': 'Elementos por Pagina' },
                                                        native: true,
                                                    }}
                                                    onChangePage={handleChangePage}
                                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                                    ActionsComponent={TablePaginationActions}
                                                />
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                                )
                            }
        </Fragment>
    );
};

export default OportunidadesTerminadas;
