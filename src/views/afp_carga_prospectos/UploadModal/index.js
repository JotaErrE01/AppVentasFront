import React, { useState, useRef } from 'react';

import {
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	IconButton,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	withStyles
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import CloudUploadOutlined from '@material-ui/icons/CloudUploadOutlined';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/styles';
import Select from 'src/components/FormElements/InputSelect';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';


const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
});

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(2),
		// textAlign: 'center',
		color: theme.palette.text.secondary
	},
	modalTitle: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
}));

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const UploadModal = ({ loading, open, onClose, uploadFile, origenes }) => {
	const classes = useStyles();

	const [fileToSend, setFileToSend] = useState();

	const fileRef = useRef(null);

	let adjuntosUploading = false;

	const encodeBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => {
				resolve(fileReader.result);
			};
			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	};

	const onFileChange = async (event) => {
		const file = event.target.files[0];
		let base64 = await encodeBase64(file);
		setFileToSend({ nombre: file.name, base64 });
	};

	const handleClose = () => {
		setFileToSend();
		onClose();
	}

	return (
		<Dialog
			fullWidth
			maxWidth="sm"
			open={open}
			onClose={onClose}
			scroll="paper"
		// style={{ width: '80%', height: '80%', minHeight: '400px', margin: 'auto' }}
		>
			<DialogTitle onClose={handleClose}>
				Cargar prospectos
			</DialogTitle>
			<DialogContent>
				<Box m="3">
					<Formik
						initialValues={{ origen: '' }}
						validationSchema={Yup.object().shape({
							origen: Yup.string().required('Se debe elegir una opción')
						})}
						onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
							uploadFile({ ...fileToSend, ...values });
						}}
					>
						{({
							errors,
							handleBlur,
							handleChange,
							handleSubmit,
							isSubmitting,
							touched,
							setFieldValue,
							values
						}) => (
							<form onSubmit={handleSubmit}>
								<Box m="3">
									<Field
										error={Boolean(touched.origen && errors.origen)}
										helperText={touched.origen && errors.origen}
										label="Origen"
										name="origen"
										id="origen"
										onChange={handleChange}
										onBlur={handleBlur}
										data={origenes.map((item) => {
											return { ...item, codigo: item.id };
										})}
										value={values.origen}
										component={Select}
									/>
								</Box>
								<br />
								<Box m="3">
									<Card onClick={() => !loading && fileRef.current.click()}>
										<CardContent>
											<div>
												{!fileToSend ? (
													<ListItem>
														<ListItemIcon>
															<CloudUploadIcon />
														</ListItemIcon>
														<ListItemText
															primaryTypographyProps={{
																variant: 'h5'
															}}
															primary="Selecciona un archivo"
														/>
													</ListItem>
												) : (
													<div>
														<Typography
															color="textSecondary"
															variant="h5"
															align="center"
															icon
														>
															{fileToSend.nombre}
														</Typography>
														<Typography
															color="textSecondary"
															variant="body1"
															align="center"
														>
															Cambiar archivo
														</Typography>
													</div>
												)}
											</div>
											<input
												ref={fileRef}
												type="file"
												style={{ display: 'none' }}
												onChange={onFileChange}
												accept=".csv"
											/>
										</CardContent>
									</Card>
									<br />
									{fileToSend && (
										<div style={{ textAlign: 'center' }}>
											<Box m={1} style={{ textAlign: 'center' }}>
												<Button
													type="submit"
													variant="contained"
													color="default"
													className={classes.button}
													disabled={loading}
													startIcon={<CloudUploadOutlined />}
												>
													Subir
												</Button>
											</Box>
										</div>
									)}
									<br />
								</Box>
							</form>
						)}
					</Formik>
				</Box>
			</DialogContent>
			{loading && (
				<DialogActions>
					<CircularProgress size={30} />
				</DialogActions>
			)}
		</Dialog>
	);
};



export default UploadModal;