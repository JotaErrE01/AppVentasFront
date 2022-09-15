import React, { useState, useEffect } from 'react';
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import SeleccionCliente from './SeleccionCliente';
import SeleccionFondo from './SeleccionFondo';
import { useParams } from 'react-router';
import { useDispatch } from 'src/store';
import { loadIntencionId } from 'src/slices/intencion';
import ModalAsingaProspecto from './ModalAsingaProspecto';
import { debounce } from 'lodash';

const SELECCION_FONDO = 'SELECCION_FONDO';
const SELECCION_CLIENTE = 'SELECCION_CLIENTE';
const SELECCION_PROSPECTO = 'SELECCION_PROSPECTO';

const useStyles = makeStyles((theme) => ({
	root: {
		background: 'rgba(0,0,0,.38)',
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: 100
	}
}));

const SeleccionFondoClienteView = () => {
	const [mode, setMode] = useState(SELECCION_PROSPECTO);
	const classes = useStyles();
	const { intencionId } = useParams();
	const dispatch = useDispatch();



	useEffect(() => {
		(intencionId) && dispatch(loadIntencionId(intencionId, () => { }));
	}, [])




	return (
		<Page className={classes.root} title="Seleccionar Tipo de Fondo">


			<Container maxWidth="lg">
				{
					mode == SELECCION_PROSPECTO
						? (<ModalAsingaProspecto onNextStep={() => setMode(SELECCION_FONDO)} />)
						: mode == SELECCION_FONDO
							? (<SeleccionFondo onFondoSelect={() => setMode(SELECCION_CLIENTE)} />)
							: (<SeleccionCliente onFondoSelect={() => setMode(SELECCION_FONDO)} />)

				}

			</Container>
		</Page>
	);
};

export default SeleccionFondoClienteView;
