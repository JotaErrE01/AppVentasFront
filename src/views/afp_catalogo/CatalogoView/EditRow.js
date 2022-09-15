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
	let [ catalogo, setcatalogo ] = useState(initData);
	let [ errors, setErrors ] = useState({});

	const classes = useStyles();

	const handleChange = (event) => {
		event.preventDefault();
		let _catalogo = { ...catalogo };
		_catalogo[event.target.name] = event.target.value;

		setcatalogo({ ..._catalogo });
	};

	const handleSubmit = (event) => {
		let hasErrors = false;

		if (!catalogo.cat_id) {
			errors['cat_id'] = 'requerido';
			hasErrors = true;
		} else {
			delete errors.cat_id;
		}

		if (!catalogo.codigo) {
			errors['codigo'] = 'requerido';
			hasErrors = true;
		} else {
			delete errors.codigo;
		}

		if (!catalogo.contenido) {
			errors['contenido'] = 'requerido';
			hasErrors = true;
		} else {
			delete errors.contenido;
		}

		setErrors({ ...errors });

		if (hasErrors) return;

		onSubmit(catalogo);
	};

	return (
		<TableRow hover>
			<TableCell>
				<TextField
					fullWidth
					error={Boolean(errors.cat_id)}
					helperText={errors.cat_id}
					label="Cat_id"
					name="cat_id"
					disabled={isLoading}
					onChange={handleChange}
					type="text"
					value={catalogo.cat_id}
					variant="outlined"
					disabled
				/>
			</TableCell>
			<TableCell>
				<FormControl variant="outlined" className={classes.formControl} error={Boolean(errors.cat_id)}>
					<InputLabel id="cat-id-select">Catálogo</InputLabel>
					<Select
						labelId="cat-id-select"
						error={Boolean(errors.cat_id)}
						name="cat_id"
						id="demo-simple-select-outlined"
						value={catalogo.cat_id}
						onChange={handleChange}
						label="Catálogo"
					>
						{catalogosMaestros.map((catalogo) => (
							<MenuItem value={catalogo.cat_id}>{catalogo.cat_descripcion}</MenuItem>
						))}
					</Select>
					{errors.cat_id && <FormHelperText>{errors.cat_id}</FormHelperText>}
				</FormControl>
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
					value={catalogo.codigo}
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
					value={catalogo.contenido}
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
					value={catalogo.contenido_2}
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
					value={catalogo.contenido_3}
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
					value={catalogo.orden_estricto}
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
			{
				!isLoading ? (
				<>
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
				</>) : (<TableCell colSpan="2" align="center">
					<CircularProgress />
				</TableCell>)
			}
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
	initData: { cat_id: '', cat_descripcion: '' },
	onCancelEditing: () => {},
	onSubmit: () => {},
	isLoading: false
};

export default EditRow;
