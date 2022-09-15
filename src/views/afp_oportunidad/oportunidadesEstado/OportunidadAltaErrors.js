import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	CardHeader,
	List,
	ListItem,
	ListItemText,
	Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useDispatch, useSelector } from 'src/store';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular
	}
}));

function OportunidadAltaErrors() {
	
	const classes = useStyles();

	let isJson = function(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	const { oportunidadTieneEstados } = useSelector((state) => state.oportunidad);

	let estado = oportunidadTieneEstados.find((op) => op.oportunidad_estado_id == 13);
	
	let lista = [];
	if (estado && isJson(estado.respuesta_json)) {
		let data = JSON.parse(estado.respuesta_json);
		
		if (data && data.estado) {
			let errorEmpresa;

			if (data.listadoErrores) {
				data.listadoErrores.forEach((err) => {
					if (err.descripcion.indexOf('RUC') == -1) {
						lista.push({ tipo: 'error', titulo: err.codigoError, descripcion: err.descripcion });
					} else {
						errorEmpresa = { tipo: 'warning', titulo: err.codigoError, descripcion: err.descripcion };
					}
				});

				if (errorEmpresa) {
					lista = [ errorEmpresa, ...lista ];
				}
			} else {
				lista.push({
					tipo: 'error',
					titulo: 'Error interno',
					descripcion: 'Hay errores internos de validación, contactarse con el departamento técnico'
				});
			}
		} else if(data) {
			for (let key in data) {
				lista.push({ tipo: 'error', titulo: key, descripcion: data[key] });
			}
		}
	}	

	return (
		<div className={classes.root}>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
					<Typography variant='h5'>Novedades de la validación</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<List style={{ width: '100%' }}>
						{lista.map((err) => (
							<ListItem key={err.descripcion} style={{ width: '100%' }}>
								<Alert severity={err.tipo} style={{ width: '100%' }}>
									{err.titulo} — {err.descripcion}
								</Alert>
								{/* <ListItemAvatar>
									<Avatar>
										<FolderIcon />
									</Avatar>
								</ListItemAvatar> */}
								{/* <ListItemText
									primary={err}
									secondary={secondary ? 'Secondary text' : null}
								/> */}
							</ListItem>
						))}
					</List>
				</AccordionDetails>
			</Accordion>
		</div>
	);
}

export default OportunidadAltaErrors;
