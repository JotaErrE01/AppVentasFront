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
	Avatar,
	Box,
	Button,
	Card,
	Checkbox,
	Divider,
	IconButton,
	InputAdornment,
	Link,
	SvgIcon,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Tabs,
	TextField,
	Typography,
	makeStyles,
	TableSortLabel,
	CircularProgress
} from '@material-ui/core';
import { Check as CheckIcon, X as CloseIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
	root: {},
	queryField: {
		width: 500
	},
	bulkOperations: {
		position: 'relative'
	},
	bulkActions: {
		paddingLeft: 4,
		paddingRight: 4,
		marginTop: 6,
		position: 'absolute',
		width: '100%',
		zIndex: 2,
		backgroundColor: theme.palette.background.default
	},
	bulkAction: {
		marginLeft: theme.spacing(2)
	},
	avatar: {
		height: 42,
		width: 42,
		marginRight: theme.spacing(1)
	}
}));

const EditRow = ({
	className,
	onCancelEditing,
	onSubmit,
	isLoading,
	initData = { cat_id: '', cat_descripcion: '' },
	...rest
}) => {
	let [ categoria, setCategoria ] = useState(initData);
	let [ errors, setErrors ] = useState({});

	const classes = useStyles();

	const handleChange = (event) => {
		event.preventDefault();
		let _categoria = { ...categoria };
		_categoria[event.target.name] = event.target.value;

		setCategoria({ ..._categoria });
	};

	const handleSubmit = (event) => {
		let hasErrors = false;

		if (!categoria.cat_id) {
			errors['cat_id'] = 'requerido';
			hasErrors = true;
		} else {
			delete errors.cat_id;
		}

		if (!categoria.cat_descripcion) {
			errors['cat_descripcion'] = 'requerido';
			hasErrors = true;
		} else {
			delete errors.cat_descripcion;
		}

		setErrors({ ...errors });

		if (hasErrors) return;

		onSubmit(categoria);
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
					value={categoria.cat_id}
					variant="outlined"
				/>
			</TableCell>
			<TableCell>
				<TextField
					fullWidth
					error={Boolean(errors.cat_descripcion)}
					helperText={errors.cat_descripcion}
					label="Descripción"
					name="cat_descripcion"
					disabled={isLoading}
					onChange={handleChange}
					type="text"
					value={categoria.cat_descripcion}
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
