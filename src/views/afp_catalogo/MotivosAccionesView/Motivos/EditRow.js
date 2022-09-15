import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
	IconButton,
	SvgIcon,
	TableCell,
	TableRow,
	TextField,
	makeStyles,
	CircularProgress,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText
} from '@material-ui/core';
import { Check as CheckIcon, X as CloseIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
	root: {},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	}
}));

const EditRow = ({
	catalogosMaestros,
	className,
	onCancelEditing,
	onSubmit,
	isLoading,
	initData = { cat_id: '', cat_descripcion: '' },
	...rest
}) => {
	let [ motivo, setMotivo ] = useState(initData);
	let [ errors, setErrors ] = useState({});

	const classes = useStyles();

	const handleChange = (event) => {
		event.preventDefault();
		let _motivo = { ...motivo };
		_motivo[event.target.name] = event.target.value;

		setMotivo({ ..._motivo });
	};

	const handleSubmit = (event) => {
		let hasErrors = false;

		// if (!motivo.cat_id) {
		// 	errors['cat_id'] = 'requerido';
		// 	hasErrors = true;
		// } else {
		// 	delete errors.cat_id;
		// }

		if (!motivo.codigo) {
			errors['codigo'] = 'requerido';
			hasErrors = true;
		} else {
			delete errors.codigo;
		}

		if (!motivo.contenido) {
			errors['contenido'] = 'requerido';
			hasErrors = true;
		} else {
			delete errors.contenido;
		}

		setErrors({ ...errors });

		if (hasErrors) return;

		onSubmit(motivo);
	};

	return (
		<TableRow hover>
			<TableCell>
				<TextField
					fullWidth
					label="Cat_id"
					name="cat_id"
					onChange={handleChange}
					type="text"
					value={motivo.cat_id}
					variant="outlined"
					disabled
				/>
			</TableCell>
			<TableCell>
				<TextField
					fullWidth
					label="Catálogo"
					name="cat_descripcion"
					disabled={true}
					onChange={handleChange}
					type="text"
					value={motivo.cat_descripcion}
					variant="outlined"
					disabled
				/>
			</TableCell>
			<TableCell>
				<TextField
					fullWidth
					error={Boolean(errors.codigo)}
					helperText={errors.codigo}
					label="Código"
					name="codigo"
					disabled={isLoading}
					onChange={handleChange}
					type="text"
					value={motivo.codigo}
					variant="outlined"
				/>
			</TableCell>
			<TableCell>
				<TextField
					fullWidth
					error={Boolean(errors.contenido)}
					helperText={errors.contenido}
					label="Contenido"
					name="contenido"
					disabled={isLoading}
					onChange={handleChange}
					type="text"
					value={motivo.contenido}
					variant="outlined"
				/>
			</TableCell>
			<TableCell>
				<TextField
					fullWidth
					error={Boolean(errors.contenido_2)}
					helperText={errors.contenido_2}
					label="Contenido_2"
					name="contenido_2"
					disabled={isLoading}
					onChange={handleChange}
					type="text"
					value={motivo.contenido_2}
					variant="outlined"
				/>
			</TableCell>
			<TableCell>
				<TextField
					fullWidth
					error={Boolean(errors.contenido_3)}
					helperText={errors.contenido_3}
					label="Contenido_3"
					name="contenido_3"
					disabled={isLoading}
					onChange={handleChange}
					type="text"
					value={motivo.contenido_3}
					variant="outlined"
				/>
			</TableCell>
			<TableCell>
				<TextField
					fullWidth
					error={Boolean(errors.orden_estricto)}
					helperText={errors.orden_estricto}
					label="Orden"
					name="orden_estricto"
					disabled={isLoading}
					onChange={handleChange}
					type="text"
					value={motivo.orden_estricto}
					variant="outlined"
				/>
			</TableCell>
			<TableCell>
				<TextField
					// error={Boolean(touched.password && errors.password)}
					fullWidth
					// helperText={touched.password && errors.password}
					label="Estado"
					name="estado"
					// onBlur={handleBlur}
					// onChange={handleChange}
					disabled
					type="text"
					value={'A'}
					variant="outlined"
				/>
			</TableCell>
			{!isLoading ? (
				<React.Fragment>
					<TableCell>
						<IconButton onClick={handleSubmit}>
							<SvgIcon fontSize="small">
								<CheckIcon />
							</SvgIcon>
						</IconButton>
					</TableCell>
					<TableCell>
						<IconButton onClick={onCancelEditing}>
							<SvgIcon fontSize="small">
								<CloseIcon />
							</SvgIcon>
						</IconButton>
					</TableCell>
				</React.Fragment>
			) : (
				<TableCell colSpan="2" align="center">
					<CircularProgress />
				</TableCell>
			)}
		</TableRow>
	);
};

EditRow.propTypes = {
	className: PropTypes.string,
	onCancelEditing: PropTypes.func,
	onSubmit: PropTypes.func,
	isLoading: PropTypes.bool,
	initData: PropTypes.object
};

EditRow.defaultProps = {
	initData: { cat_id: 'VM', cat_descripcion: 'MOTIVOS', estado: 'A' },
	onCancelEditing: () => {},
	onSubmit: () => {},
	isLoading: false
};

export default EditRow;
