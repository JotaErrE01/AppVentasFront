import React, { useState, Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import HeaderBreakcumbs from '../../../components/FormElements/headerBreakcumbs';
import { useHistory, useParams } from 'react-router';
import FormMaster from './formularios/FormMaster';
import FormRentaPlus from './formularios/FormRentaPlus';
import Form2 from './formularios/Form2';
import EmpresaOportunity from '../fondo_largo_plazo/formularios/EmpresaOportunity';

const FondoCortoPlazo = () => {
	const history = useHistory();

	let [ currentPage, setCurrentPage ] = useState(1);

	const name = useSelector((state) => state.cliente.StepCharge.primer_nombre);
	const lastName = useSelector((state) => state.cliente.StepCharge.primer_apellido);

	const { codigoFondo, paso } = useParams();

	const renderFondo = () => {
		if (codigoFondo == '000029' || codigoFondo == '000033' || codigoFondo == '000040') {
			return <FormMaster setPage={setPage} />;
		} else if (codigoFondo == '000038') {
			return <FormRentaPlus setPage={setPage} />;
		}

		return <p>No existe fondo con código {codigoFondo}</p>;
	};

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
				{/* {renderFondo()} */}

				{(() => {
					if (currentPage == 1) {
						return renderFondo();
					} else if (currentPage == 2) {
						return <Form2 setPage={setPage} />;
					} else if (currentPage == 3) {
						return <EmpresaOportunity setPage={setPage} />;
					}
				})()}
			</Box>
		</Fragment>
	);
};

export default FondoCortoPlazo;
