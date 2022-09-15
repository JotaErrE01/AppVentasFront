import React, { useEffect, Fragment } from 'react';
import { useState } from 'react';
import { Card, makeStyles, List, ListItem, ListItemText, Divider, Button, Grid, Box } from '@material-ui/core';
import { useSelector, useDispatch } from 'src/store';
import FormConsultarCedula from '../formularios/FormConsultarCedulaCliente';
import Header from '../buscar_cliente/Header';
import { getDeleteInformationWithRefuse, resetCosultarData } from 'src/slices/clientes';
// import CodigoFondoCortoPlazoFI from '../../JSON_CATALOGOS/CODIGO_FONDO_CORTO_PLAZO_FI';
// import CodigoFondoLargoPlazoFH from '../../JSON_CATALOGOS/CODIGO_FONDO_LARGO_PLAZO_FH';
import { getDeleteInformationWithRefuseEmpresa } from 'src/slices/empresas';
import { getCatalogoFondoHorizonte, getCatalogoFondoInversion } from 'src/slices/catalogos';
import useAuth from 'src/contextapi/hooks/useAuth';
import { useHistory } from 'react-router';
import ClienteSelected from '../buscar_cliente/ClienteSelected';

const useStyles = makeStyles((theme) => ({
	title: {
		fontFamily: 'Roboto',
		fontSize: '16px',
		fontStyle: 'normal',
		fontWeight: '500',
		lineHeight: '20px',
		letterSpacing: '-0.05000000074505806px',
		textAlign: 'left'
	},
	paper: {
		padding: theme.spacing(2),
		margin: 'auto',
		maxWidth: 637
	},
	controls: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	},
	list: {
		width: '100%',
		backgroundColor: theme.palette.background.paper
	},
	flex: {
		flexGrow: 1
	}
}));

const SeleccionCliente = ({ onFondoSelect }) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const { ConsultarData: cliente, fondoSeleccionado } = useSelector((state) => state.cliente);

	useEffect(() => {
		dispatch(getDeleteInformationWithRefuse());
		dispatch(getDeleteInformationWithRefuseEmpresa());
	}, []);

	const handleDelete = () => {
		dispatch(getDeleteInformationWithRefuse());
		dispatch(getDeleteInformationWithRefuseEmpresa());
		onFondoSelect();
	};

	return (
		<Card style={{ marginTop: 100 }} className={classes.paper}>
			<Grid container spacing={2}>
				<Grid item xs={12} sm container>
					<Grid item xs container direction="column">
						<Header
							header={
								cliente.id ? (
									<h4>¿Estás seguro de seleccionar este cliente?</h4>
								) : (
									<h4>Buscar cliente</h4>
								)
							}
							classTitle={classes.title}
							handleDelete={handleDelete}
							// goBack={() => history.goBack()}
						/>
						<Divider light={true} />
						{!cliente.id ? (
							<FormConsultarCedula />
						) : (
							<ClienteSelected
								cliente={cliente}
								fondoSeleccionado={fondoSeleccionado}
								handleNo={() => dispatch(resetCosultarData())}
							/>
						)}
					</Grid>
				</Grid>
			</Grid>
		</Card>
	);
};

export default SeleccionCliente;
