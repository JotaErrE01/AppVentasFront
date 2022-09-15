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
	FormHelperText,
	Card,
	CardHeader
} from '@material-ui/core';
import { Check as CheckIcon, X as CloseIcon } from 'react-feather';
import { SketchPicker } from 'react-color';

const useStyles = makeStyles((theme) => ({
	root: {},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	}
}));

const EditForm = ({
	catalogosMaestros,
	classes,
	className,
	onCancelEditing,
	onSubmit,
	isLoading,
	initData,
	...rest
}) => {
	let [ fase, setFase ] = useState(initData);
	let [ errors, setErrors ] = useState({});

	const handleChangeComplete = (color) => {
		// setBorderColor(color.hex);

		setFase({ ...fase, contenido_2: color.hex });
	};

	const handleChange = (event) => {
		event.preventDefault();
		let _fase = { ...fase };
		_fase['codigo'] = event.target.value;
		_fase['contenido'] = event.target.value;

		setFase({ ..._fase });
	};

	const handleSubmit = (event) => {
		let hasErrors = false;

		if (!fase.contenido) {
			errors['contenido'] = 'Este campo es requerido';
			hasErrors = true;
		} else {
			delete errors.contenido;
		}

		setErrors({ ...errors });

		if (hasErrors) return;

		onSubmit({ ...fase, cat_id: 'FEV' });
	};

	return (
		<div>
			<Card className={classes.cardFase} style={{ marginBottom: '.5rem' }}>
				<CardHeader
					className={classes.cardFaseHeader}
					style={{ borderTop: `5px solid ${fase.contenido_2 || '#3D4852'}` }}
					action={
						!isLoading ? (
							<div>
								<IconButton aria-label="settings" onClick={handleSubmit}>
									<CheckIcon />
								</IconButton>
								<IconButton aria-label="settings" onClick={onCancelEditing}>
									<CloseIcon />
								</IconButton>
							</div>
						) : (
							<CircularProgress />
						)
					}
					title={
						<TextField
							fullWidth
							error={Boolean(errors.contenido)}
							helperText={errors.contenido}
							label="Nombre"
							name="contenido"
							disabled={isLoading}
							onChange={handleChange}
							type="text"
							value={fase.contenido}
							// variant="outlined"
							// disabled
						/>
					}
				/>
			</Card>
			<div
				style={{
					position: 'absolute',
					zIndex: '2'
				}}
			>
				<SketchPicker color={fase.contenido_2} onChangeComplete={handleChangeComplete} />
			</div>
		</div>
	);
};

EditForm.propTypes = {
	className: PropTypes.string,
	onCancelEditing: PropTypes.func,
	onSubmit: PropTypes.func,
	isLoading: PropTypes.bool,
	initData: PropTypes.object
};

EditForm.defaultProps = {
	initData: { cat_id: 'FEV', codigo: '', contenido: '', contenido_2: '#3D4852' },
	onCancelEditing: () => {},
	onSubmit: () => {},
	isLoading: false
};

export default EditForm;
