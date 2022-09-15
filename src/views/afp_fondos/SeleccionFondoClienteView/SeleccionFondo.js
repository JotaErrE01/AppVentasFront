import React, { useEffect, Fragment } from 'react';
import { useState } from 'react';
import { Card, makeStyles, List, ListItem, ListItemText, Divider, Button, Grid, Box } from '@material-ui/core';
import { useSelector, useDispatch } from 'src/store';
import FormConsultarCedula from '../formularios/FormConsultarCedulaCliente';
import Header from '../buscar_cliente/Header';
import { getDeleteInformationWithRefuse, setFondoSelected, setOportunidad } from 'src/slices/clientes';
// import CodigoFondoCortoPlazoFI from '../../JSON_CATALOGOS/CODIGO_FONDO_CORTO_PLAZO_FI';
// import CodigoFondoLargoPlazoFH from '../../JSON_CATALOGOS/CODIGO_FONDO_LARGO_PLAZO_FH';
import { getDeleteInformationWithRefuseEmpresa } from 'src/slices/empresas';
import { getCatalogoFondoHorizonte, getCatalogoFondoInversion } from 'src/slices/catalogos';
import useAuth from 'src/contextapi/hooks/useAuth';
import { useHistory } from 'react-router';
import JSONTree from 'react-json-tree';

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

// const pickOptions = (user, fondoHorizonte, fondoInversion) => {


// 	const authorize = user.permisos.find(item=> item.guard === "edit_sales");
// 	const tipo_venta_asesor = user.tipo_venta_asesor;


	
// 	if(authorize){
// 		
// 		switch (tipo_venta_asesor) {
// 			case 0:
// 				return [];
// 			case 1:
// 				return fondoHorizonte;
// 			case 2:
// 				return fondoInversion;
// 			case 3:
// 				return [ ...fondoInversion, ...fondoHorizonte ];
// 			default:
// 				return [];
// 		}
// 	}


// };



const SeleccionFondo = ({ onFondoSelect }) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [ buttonStyle, setbuttonStyle ] = useState(true);
	const [ selectFondo, setSelectFondo ] = useState({});

	let { fondoHorizonte = [], fondoInversion = [] } = useSelector((state) => state.catalogo);

	const history = useHistory();

	const { user } = useAuth();

	// const ObjectMap = pickOptions(user, fondoHorizonte, fondoInversion);

	const tipoFondoArr = [...fondoHorizonte, ...fondoInversion]	

	useEffect(() => {


		const authorize = user.permisos.find(item=> item.guard === "edit_sales");
		const tipo_venta_asesor = user.tipo_venta_asesor;

		
		if(authorize && tipoFondoArr.length <= 0){



			if(tipo_venta_asesor==1){
				dispatch(getCatalogoFondoHorizonte());
			}
			if(tipo_venta_asesor==2){
				dispatch(getCatalogoFondoInversion());
			}
			if(tipo_venta_asesor==3){
				dispatch(getCatalogoFondoHorizonte());
				dispatch(getCatalogoFondoInversion());
			}


		}
		
		// if (fondoHorizonte && fondoHorizonte.length == 0) {
		// 	dispatch(getCatalogoFondoHorizonte());
		// }

		// if (fondoHorizonte && fondoInversion.length == 0) {
		// 	dispatch(getCatalogoFondoInversion());
		// }

		dispatch(getDeleteInformationWithRefuse());
		dispatch(getDeleteInformationWithRefuseEmpresa());
		dispatch(setOportunidad({}));
	}, []);

	

	const activButton = (fondo) => {
		setbuttonStyle(false);
		setSelectFondo(fondo);
		dispatch(setFondoSelected(fondo));
	};



	return (
		// <Fragment className={classes.flex}>
		<Fragment>

			
			<Card style={{ marginTop: 100 }} className={classes.paper}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm container>
						<Grid item xs container direction="column">
							<Header
								header={<h4>Selecciona el tipo de fondo</h4>}
								classTitle={classes.title}
								// handleDelete={handleDelete}
								goBack={() => history.goBack()}
							/>
							<Divider light={true} />
							<Box mb={6}>
								<Grid item>
									<List component="nav" className={classes.list} aria-label="mailbox folders">
										{tipoFondoArr.map((item, index) => (
											<ListItem onClick={() => activButton(item)} key={index} button>
												<ListItemText primary={item.contenido} />
											</ListItem>
										))}
									</List>
								</Grid>
							</Box>
							<Divider light={true} />
							<br />
							<Grid item xs container direction="row" justify="flex-end">
								{buttonStyle ? (
									<Button disabled color="primary">
										continuar
									</Button>
								) : (
									<Button
										onClick={() => onFondoSelect()}
										style={{ color: 'white', background: 'black' }}
									>
										continuar
									</Button>
								)}
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Card>
		</Fragment>
	);
};

export default SeleccionFondo;
