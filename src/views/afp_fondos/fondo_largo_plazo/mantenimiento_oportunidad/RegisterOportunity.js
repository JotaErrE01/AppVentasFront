import React, { useState, Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import FormRegisterOportunity from '../formularios/FormRegisterOportunity';
import HeaderBreakcumbs from '../../../../components/FormElements/headerBreakcumbs';
import { useHistory, useParams } from 'react-router';
import EmpresaOportunity from '../formularios/EmpresaOportunity';
import { useDispatch } from 'src/store';
import { getCatalogoAeHorizonte, getCatalogosFondos, getGeoCatalogos } from 'src/slices/catalogos';
import { getClienteById, getFondoAporteEdit, setOportunidad } from 'src/slices/clientes';

const route = (history) => {
	const nameRoute = history.location.pathname;
	return nameRoute;
};

const RegisterOportunity = () => {
	let [ currentPage, setCurrentPage ] = useState(1);

	const dispatch = useDispatch();

	const name = useSelector((state) => state.cliente.StepCharge.primer_nombre);
	const lastName = useSelector((state) => state.cliente.StepCharge.primer_apellido);

	const { Oportunidad: oportunidad, ConsultarData: cliente } = useSelector((state) => state.cliente);

	const history = useHistory();
	const { idCliente, idOportunidad, paso } = useParams();

	useEffect(
		() => {
			if (idCliente && idCliente != cliente.id) {
				dispatch(getClienteById(idCliente));
			} else if (idOportunidad && oportunidad && idOportunidad != oportunidad.id) {
				dispatch(setOportunidad({}));
				dispatch(getFondoAporteEdit(idOportunidad));
			}

			dispatch(getCatalogoAeHorizonte());
			dispatch(getCatalogosFondos('000001'));
		},
		[ cliente ]
	);

	if (paso) {
		currentPage = +paso;
	}

	const setPage = (page) => {
		setCurrentPage(page);
	};

	return (
		<Fragment>
			<Box m={3}>
				<HeaderBreakcumbs
					// route={`/afp/crm/oportunidad/mantenimientoOportunidad/${fondoCortoAndLargoPlazo}`}
					onClickRoute1={() => history.goBack()}
					routename1="Mantenimiento de la oportunidad"
					routename2="Mantenimiento de fondo"
					titlepageName={name}
					titlepageLastName={lastName}
				/>
			</Box>
			{(() => {
				if (currentPage == 1) {
					return <FormRegisterOportunity setPage={setPage} />;
				} else if (currentPage == 2) {
					return <EmpresaOportunity setPage={setPage} />;
				}
			})()}
		</Fragment>
	);
};

export default RegisterOportunity;
