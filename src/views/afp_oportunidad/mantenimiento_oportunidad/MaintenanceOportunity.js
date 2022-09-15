import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation, useParams, useHistory } from 'react-router-dom';
import _ from 'lodash'
import { useSelector, useDispatch } from 'src/store';
import { green, amber, red } from '@material-ui/core/colors';
import {
	Box,
	Card,
	Avatar,
	colors,
	Container,
	Link,
	Button,
	Typography,
	makeStyles,
	Paper,
	Divider,
	Grid,
	CardHeader,
	List,
	ListItemText,
	Modal,
	CardContent,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	CardActions,
	Chip,
	Tooltip,
	ListItem,
	ListItemIcon,
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';
import Page from 'src/components/Page';
import EditIcon from '@material-ui/icons/Edit';
import ListIcon from '@material-ui/icons/ListAltOutlined';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import CloudUploadOutlined from '@material-ui/icons/CloudUploadOutlined';
import CloseIcon from '@material-ui/icons/Close';
import PaymentIcon from '@material-ui/icons/Payment';
import { Upload as UploadIcon } from 'react-feather';

import OportunidadesEstado from 'src/views/afp_oportunidad/oportunidadesEstado';
import SvgIcon from '@material-ui/core/SvgIcon';
import DoneIcon from '@material-ui/icons/Done';
import WarnIcon from '@material-ui/icons/WarningRounded';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import {
	getFondoAporteEdit,
	getObtenerDocumentosOportunidad,
	postEnviarDocumentos,
	setOportunidad,
	generateContratoHorizonte,
	generateContratoMaster,
	generateContratoRentaPlus,
	generateAutorizacionBancaria,
	generateAutorizacionRol,
	getClienteById,
	cleanAdjuntosInfo,
	generateContratoEstrategico,
	generateContratoSuperior,
	postEnviarDocumentos2,
	generateConsentimientoProteccionDatos
} from 'src/slices/clientes';
import { useSnackbar } from 'notistack';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PeopleIcon from '@material-ui/icons/People';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { Cropper } from 'react-cropper';
import HeaderBreakcumbs from '../../../components/FormElements/headerBreakcumbs';
import {
	getCatalogo,
	getCatalogoActividades,
	getCatalogoFondoHorizonte,
	getCatalogoFondoInversion,
	getCatalogoOrigenHorizonte,
	getCatalogoOrigenInversion
} from 'src/slices/catalogos';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Skeleton } from '@material-ui/lab';
import ActividadGrid from 'src/views/afp_oportunidad/mantenimiento_oportunidad/ActividadGrid';
import { asignarActividadOportunidad, getActividadByUser } from 'src/slices/actividad';
import useAuth from 'src/contextapi/hooks/useAuth';

import { sendToSign } from 'src/slices/adjuntos';
import { Replay } from '@material-ui/icons';
import { cleanOportunidadTieneEstados, postOportunidadTieneEstado, postOportunidadTieneEstadoSignedFiles, senMailBienvenida } from 'src/slices/oportunidad';
import OportunidadAltaErrors from '../oportunidadesEstado/OportunidadAltaErrors';

import { ReactComponent as SignatureIcon } from 'src/assets/icons/signature_icon.svg';

import imageCompression from 'browser-image-compression';
import CustomDialog from 'src/components/common/CustomDialog';
import { DobleCaraCanvas } from 'src/components/common/DobleCaraCanvas';
import { blobToUrl, urlDownload, getMimeTypeB64, readURL, blobToType } from 'src/utils/filehelpers';

const CREAR = 'CREAR';
const EDITAR = 'EDITAR';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},



	imageIcon: {
		height: '.9em'
	},
	iconRoot: {
		textAlign: 'center'
	},


	avatar: {
		backgroundColor: colors.red[500],
		color: colors.common.white
	},
	paper: {
		padding: theme.spacing(2),
		// textAlign: 'center',
		color: theme.palette.text.secondary
	},
	oportunidadInfo: {
		textAlign: 'center'
	},
	table: {
		minWidth: 650
	},
	ButtonCrearFondo: {

		background: 'black',
		color: 'white',
		marginRight: '.3em'
	},
	TitleCard: {
		textAlign: 'left'
	},
	TitleList: {
		textAlign: 'left',
		marginLeft: theme.spacing(2)
	},
	modalTitle: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
}));

const MaintenanceOportunity = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [cropper, setCropper] = useState();
	const [beneficiario, setBeneficiarioSelected] = useState();
	const [openModalUploadImage, setOpenModalUploadImage] = useState(false);
	const [openModalActividades, setOpenModalActividades] = useState(false);
	const [openModalConfirm, setOpenModalConfirm] = useState(false);
	const [idActividadSelected, setActividadIdSelected] = useState();

	const [adjuntoToUpload, setAdjuntoToUpload] = useState();
	const [fileToSend, setFileToSend] = useState();
	// const [ nombreFondo, setNombreFondo ] = useState('');

	const [hasToSign, setHasToSign] = useState([]);

    const [payloadIds, setPayloadIds] = useState({});
    const [subir, setSubir] = useState(false);

	const {
		ConsultarData: cliente,
		loadingOportunidad,
		loadingCliente,
		adjuntosUploading,
		loadingGenerate
	} = useSelector((state) => state.cliente);

	const _cliente = useSelector((state) => state.cliente);


	const StoreAporte = useSelector((state) => state.cliente.StoreAporte);
	const UpdateAporte = useSelector((state) => state.cliente.UpdateAporte);
	const Errores = useSelector((state) => state.cliente.Error);
	const DeleteAporte = useSelector((state) => state.cliente.DeleteAporte);
	const { fondoSeleccionado } = useSelector((state) => state.cliente);
	const LastFondoAporteCliente = useSelector((state) => state.cliente.LastFondoCliente.datos_aporte);
	const beneficiarios_sv = useSelector((state) => state.cliente.LastFondoCliente.beneficiario_sv);
	const oportunidad = useSelector((state) => state.cliente.Oportunidad);
	const crearOportunidad = useSelector((state) => state.cliente.CrearOportunidad);
	let { fondoHorizonte = [], fondoInversion = [] } = useSelector((state) => state.catalogo);

	// ACTIVIDADES
	const _actividad = useSelector((state) => state.actividad);
	const { loadingForm } = useSelector((state) => state.actividad);
	const _catalogo = useSelector((state) => state.catalogo);
	const _catalogoOrigen = [..._catalogo.origenHorizonte, ..._catalogo.origenInversion];

	const { enqueueSnackbar } = useSnackbar();
	// const fondoSeleccionado = useSelector((state) => state.cliente.fondoSeleccionado);
	const { adjuntosCheckList, archivosAdjuntos, adjuntosLoading } = useSelector((state) => state.cliente);
	const { loadingSign } = useSelector((state) => state.adjunto);

	const _op = useSelector((state) => state.oportunidad);

	const { idOportunidad, idCliente, codigoFondo } = useParams();

	const location = useLocation();
	const history = useHistory();

	const mode = oportunidad && oportunidad.id ? EDITAR : CREAR;

	const { user } = useAuth();
	const { tipo_venta_asesor, permisos } = user;

	//UPLOAD
    const fileRef = useRef(null);
	const _fileRef = useRef(null);
    const ctxRef = useRef();
    const [imageParts, setImageParts] = useState([]);


	if (StoreAporte == 1) {
		enqueueSnackbar('Fondo del cliente registrado con éxito', {
			variant: 'success'
		});
	};

	if (Errores == 1) {
		enqueueSnackbar('Algo ha salido mal en su proceso, intente nuevamente', {
			variant: 'error'
		});
	};

	if (DeleteAporte == 1) {
		enqueueSnackbar('el fondo seleccionado ha sido borrado éxitosamente', {
			variant: 'success'
		});
	};

	if (UpdateAporte == 1) {
		enqueueSnackbar('Fondo ha sido actualizado con exito', {
			variant: 'success'
		});
	};

	const handleOpenModal = (adjuntoToUpload, archivoAdjunto, beneficiario) => {
		
        // const adjunto = _.find(
        //     archivosAdjuntos,
        //     { tipo_documento_id: adjuntoToUpload.tipo_documento_id }
        // );
        // const payload = {
        //     ...adjuntoToUpload,
        //     adjunto,
        //     extension: getFileType(adjunto),
        // };

		// handleSetPayload(payload, 1);
		// setIdBeneficiario(beneficiarioId);
		// setCodCatalogo(catalogo);
		// setTypeAttach(type);
		// setNameInputFile(name);
		// setTypeDocument(tipoDocuemento);

		if (beneficiario) {
			setBeneficiarioSelected(beneficiario);
		}

		if(archivoAdjunto) {
			adjuntoToUpload = { ...adjuntoToUpload, idAdjunto: archivoAdjunto.idAdjunto }
		}
		
		setAdjuntoToUpload(adjuntoToUpload);
		setOpenModalUploadImage(true);
	};

	useEffect(() => {


		if (fondoHorizonte && fondoHorizonte.length == 0) {
			dispatch(getCatalogoFondoHorizonte());
		}

		if (fondoHorizonte && fondoInversion.length == 0) {
			dispatch(getCatalogoFondoInversion());
		}

		if (location.pathname.includes('crear')) {
			dispatch(cleanAdjuntosInfo());
		}

		if (idCliente && idCliente != cliente.id) {
			dispatch(getClienteById(idCliente));
		} else if (idOportunidad && oportunidad && idOportunidad != oportunidad.id) {
			dispatch(setOportunidad({}));
			dispatch(getObtenerDocumentosOportunidad(idOportunidad));
			dispatch(getFondoAporteEdit(idOportunidad));
		} else if (oportunidad && oportunidad.id) {
			dispatch(getObtenerDocumentosOportunidad(oportunidad.id));
		}


		const endorse_sale = permisos.find(item=>item.guard === "endorse_sale")
		const read_sales = permisos.find(item=>item.guard === "read_sales")

		// ACTIVIDADES

		if (!endorse_sale && read_sales) {
			dispatch(getActividadByUser(user, enqueueSnackbar));

			if(tipo_venta_asesor == 1 ){
				dispatch(getCatalogoActividades('_APH'));
				dispatch(getCatalogoOrigenHorizonte());
			};

			if(tipo_venta_asesor == 2 ){
				dispatch( getCatalogoActividades('_API'));
				dispatch( getCatalogoOrigenInversion());
			};

			if(tipo_venta_asesor == 3 ){
				dispatch(getCatalogoActividades('_APH'));
				dispatch( getCatalogoActividades('_API'));
				dispatch(getCatalogoOrigenHorizonte());
				dispatch( getCatalogoOrigenInversion());
			};
		}



	}, []);

	useEffect(() => {
        if (imageParts.length >= 1 && ctxRef) {
            const ctx = new DobleCaraCanvas(ctxRef.current);
            ctx.join(imageParts);
            const _save = ctx.save();

            
            setFileToSend(_save)
        }
    }, [imageParts]);

	// :: 1 :: ESTABLECE DATOS DE IMAGEN SELECCIONADA Y DISPARA EL INPUT
    const handleSetPayload = (data, isDobleCara) => {
        if (!isDobleCara) {
            fileRef.current.click();
        } else {
            _fileRef.current.click();
        }
        const { cod_adjunto_catalogo, tipo, tipo_documento_id, id_beneficiario } = data;
        setPayloadIds({
            tipo: tipo ? tipo : 3,
            cod_adjunto_catalogo,
            tipo_documento_id,
            id_beneficiario
        });
    };

    //:: 2  :: CUANDO CAMBIA inputRef
    const onChange = async event => {
        const file = event.target.files[0];
        let base64;
        if (file.type != 'application/pdf') {
            const resized = await handleCompress(file);
            base64 = await encodeBase64(resized);
            setOpenModalUploadImage(true);
        } else {
            //TODO: WATCH WHAT HAPPENS ON IMAGE
            base64 = await encodeBase64(file);
            setSubir(true);
        };
        setFileToSend({ tipo: file.type, nombre: file.name, base64 });
    };

	async function handleCompress(file) {
	
		const imageFile = file;
		console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
		console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
	
		const options = {
			maxSizeMB: 1,
			maxWidthOrHeight: 1920,
			useWebWorker: true
		}
		try {
			const compressedFile = await imageCompression(imageFile, options);
			console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
			console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
	
			return compressedFile;
		} catch (error) {
			console.log(error);
		}
	
	}

	// _HELPER FNS	
	const getFileType = (payload) => {
		if (payload) {
			const ext = payload.archivo.archivo.split(';');
			switch (ext[0]) {
				case "data:image/png": return 'imagen';
				case "data:application/pdf": return 'pdf';
				default: return 'nofile'
			}
		}
		return 'nofile'
	};




    //:: 1 ::
    const _onChange = async e => {		
        const file = e.target.files[0];

		const mbSize = file.size / 1024 / 1024;

		if(mbSize > 5) {			
			enqueueSnackbar('Solo se permiten archivos de máximo 5MB', {
				variant: 'warning'
			});

			return;
		}

		if(file.type != 'application/pdf') {
			const reader = new FileReader();
			if (file) reader.readAsDataURL(file);
			reader.onload = (read) => {
				const image = new Image();
				image.src = read.target.result;
				setImageParts([...imageParts, image]);
			};
		} else {
			uploadImage(e);
		}
    };

    //:: 2 ::
    const _clean = () => {
        setImageParts([]);
    };

    //:: 3 ::
    const _envioArchivos = () => {
		if(fileToSend.tipo != 'application/pdf') {
			const body = {
				idAdjunto: adjuntoToUpload.idAdjunto,
				oportunidad_id: oportunidad.id,
				archivo: fileToSend,
				nombre_archivo: 'documento.jpeg',
				...payloadIds
			};
	
			// dispatch(postEnviarDocumentos2(body, enqueueSnackbar));
			
			if (beneficiario) {
				body['id_beneficiario'] = beneficiario.id;
			}
	
			const onSuccess = () => {
				setOpenModalUploadImage(false);
				enqueueSnackbar('El archivo se ha subido correctamente', {
					variant: 'success'
				});
	
				setFileToSend();
				setAdjuntoToUpload();
				setBeneficiarioSelected();
				_clean();
			};
	
			dispatch(postEnviarDocumentos(body, onSuccess)); 
		} else {
			envioArchivos();
		}
    };

	const uploadImage = async (event) => {
		const file = event.target.files[0];

		const base64 = await encodeBase64(file);

		setFileToSend({ tipo: file.type, nombre: file.name, base64 });
		// setImages({ ...images, [nameInputFile]: base64 });
	};

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

	const envioArchivos = () => {
		// getCropData(nombre);

		let archivo = fileToSend;

		if (archivo.tipo != 'application/pdf') {
			archivo = { ...archivo, base64: cropper.getCroppedCanvas().toDataURL(archivo.tipo) };
		}

		const body = {
			idAdjunto: adjuntoToUpload.idAdjunto,
			oportunidad_id: oportunidad.id,
			cod_adjunto_catalogo: adjuntoToUpload.cod_adjunto_catalogo,
			archivo: archivo.base64,
			nombre_archivo: archivo.nombre,
			tipo: adjuntoToUpload.tipo,
			tipo_documento_id: adjuntoToUpload.tipo_documento_id
		};

		if (beneficiario) {
			body['id_beneficiario'] = beneficiario.id;
		}
		
		const onSuccess = () => {
			setOpenModalUploadImage(false);
			enqueueSnackbar('El archivo se ha subido correctamente', {
				variant: 'success'
			});

			setFileToSend();
			setAdjuntoToUpload();
			setBeneficiarioSelected();
		};

		dispatch(postEnviarDocumentos(body, onSuccess));
	};

	const openBase64InNewTab = (data, mimeType, filename) => {
		if (!mimeType) {
			mimeType = getMimeTypeB64(data);
		}

		data = data.split(',');
		data = data[1];

		var byteCharacters = atob(data);
		var byteNumbers = new Array(byteCharacters.length);
		for (var i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		var byteArray = new Uint8Array(byteNumbers);
		var file = new Blob([byteArray], { type: mimeType + ';base64' });
		var fileURL = URL.createObjectURL(file);
		// window.open(fileURL);
        urlDownload(fileURL, filename ? filename : 'unnamed');
	};

	const getMimeTypeB64 = (b64) => {
		let mimeType = b64.split(':');
		mimeType = mimeType[1].split(';');
		mimeType = mimeType[0];

		return mimeType;
	};

	const handleCrearEditar = () => {
		if (oportunidad && oportunidad.fondo_id == '000001') {
			history.push('/afp/crm/oportunidad/editar/registroOportunidad/' + oportunidad.id);
			return;
		} else if (oportunidad && oportunidad.id) {
			history.push(
				'/afp/crm/oportunidad/editar/registroOportunidad/' +
				oportunidad.id +
				'/cortoPlazo/' +
				oportunidad.fondo_id
			);
			return;
		}

		if (codigoFondo == '000001') {
			history.push('/afp/crm/oportunidad/crear/registroOportunidad/' + cliente.id + '/largoPlazo');
		} else {
			history.push('/afp/crm/oportunidad/crear/registroOportunidad/' + cliente.id + '/cortoPlazo/' + codigoFondo);
		}
	};

	const renderModalUploadImage = () => {
		return (
			<Dialog
				fullWidth
				maxWidth="sm"
				open={openModalUploadImage}
				onClose={() => {
						if(!adjuntosUploading) {
							setOpenModalUploadImage(false);
							setFileToSend();
							setAdjuntoToUpload();
							setBeneficiarioSelected();
							_clean();
						}
					}
				}
				scroll="paper"
			// style={{ width: '80%', height: '80%', minHeight: '400px', margin: 'auto' }}
			>
				<DialogTitle id="alert-dialog-title" disableTypography className={classes.modalTitle}>
					{/* <h3>{adjuntoToUpload.nombre}</h3> */}
					<Typography variant="h5">{adjuntoToUpload.nombre}</Typography>
					<IconButton
						onClick={() => {
								if(!adjuntosUploading) {
									setOpenModalUploadImage(false);
									setFileToSend();
									setAdjuntoToUpload();
									setBeneficiarioSelected();
									_clean();
								}
							}
						}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					{
						(imageParts.length == 0 || !fileToSend) &&
							<Card onClick={()=>{
								const adjunto = _.find(
									archivosAdjuntos,
									{ tipo_documento_id: adjuntoToUpload.tipo_documento_id }
								);
								const payload = {
									...adjuntoToUpload,
									adjunto,
									extension: getFileType(adjunto),
								};
						
								handleSetPayload(payload, 1);
							}}>
								<CardContent>
									<div>
										{
											!fileToSend ?
											<ListItem>
												<ListItemIcon>
													<CloudUploadIcon />
												</ListItemIcon>
												<ListItemText
													primaryTypographyProps={{
														variant: 'h5',										
													}}
													primary="Selecciona un archivo"
												/>
											</ListItem> :
											fileToSend.tipo == 'application/pdf' &&
											<a href="javascript:;" onClick={() => openBase64InNewTab(fileToSend.base64, null, fileToSend.nombre)}>
												{fileToSend.nombre}
											</a>
										}
										{/* <Typography
											color="textSecondary"
											variant="h5"
											align="center"
											icon
										>
											<CloudUploadIcon /> Selecciona un archivo
										</Typography>								 */}
									</div>
								</CardContent>
							</Card>

					}
					<br />
					<div style={{textAlign: 'center'}}>
						{
							imageParts.length != 0 &&
								<canvas ref={ctxRef} />
						}
						{
							fileToSend &&
								<Box m={1} style={{textAlign:"center"}}>
									<Button
										variant="contained"
										color="primary"
										className={classes.button}
										startIcon={<AddAPhoto />}
										disabled={fileToSend.tipo == 'application/pdf'}
										onClick={() => handleSetPayload(payloadIds, 1)}
									>
										Agregar
									</Button>
									{" "}
									<Button
										variant="contained"
										color="default"
										className={classes.button}
										startIcon={<CloudUploadOutlined />}
										onClick={_envioArchivos}
									>
										Subir
									</Button>
								</Box>
						}
						<input
							ref={fileRef}
							type="file" style={{ display: "none" }}
							onChange={onChange}
							accept="image/png, image/jpeg, .pdf"
						/>
						<input
							ref={_fileRef}
							type="file" style={{ display: "none" }}
							onChange={_onChange}
							accept={`image/png, image/jpeg${imageParts.length == 0 ? ', .pdf' : ''}`}
						/>						
					</div>
					<br />
					{/* {fileToSend &&
						fileToSend.tipo != 'application/pdf' && (
							<Cropper
								style={{ maxHeight: 300, width: '50%' }}
								initialAspectRatio={1}
								preview=".img-preview"
								src={fileToSend.base64}
								viewMode={1}
								guides={false}
								minCropBoxHeight={10}
								zoomable={false}
								minCropBoxWidth={10}
								background={false}
								responsive={true}
								autoCropArea={1}
								checkOrientation={false}
								onInitialized={(instance) => {
									setCropper(instance);
								}}
							/>
						)} */}
					{/* <br />
					{!fileToSend ? (
						'Por favor seleccione el documento'
					) : (
						<a href="javascript:;" onClick={() => openBase64InNewTab(fileToSend.base64)}>
							{fileToSend.nombre}
						</a>
					)}
					<br /> */}
				</DialogContent>
				{
					adjuntosUploading &&
					<DialogActions>						
						<CircularProgress size={30} />
					</DialogActions>
				}			
			</Dialog>
		);
	};

	const generateDocument = (indexGenerating) => {
		let tipoAdjunto = adjuntosCheckList.filter(
			(adjunto) =>
				// SON LOS IDS DE LOS DOCUMENTOS QUE SE AUTOGENERAN
				adjunto.es_autogenerado
		)[indexGenerating];

		const onSuccess = () => {
			enqueueSnackbar('El documento se generó correctamente', {
				variant: 'success'
			});
		};

		if (tipoAdjunto.tipo_documento_id == 11) {
			if (oportunidad && oportunidad.fondo_id == '000001') {
				dispatch(generateContratoHorizonte(oportunidad.id, onSuccess, indexGenerating));
			} else if (oportunidad && oportunidad.fondo_id == '000029') {
				dispatch(generateContratoMaster(oportunidad.id, onSuccess, indexGenerating));
			} else if (oportunidad && oportunidad.fondo_id == '000038') {
				dispatch(generateContratoRentaPlus(oportunidad.id, onSuccess, indexGenerating));
			} else if (oportunidad && oportunidad.fondo_id == '000033') {
				dispatch(generateContratoEstrategico(oportunidad.id, onSuccess, indexGenerating));
			} else if (oportunidad && oportunidad.fondo_id == '000040') {
				dispatch(generateContratoSuperior(oportunidad.id, onSuccess, indexGenerating));
			}
		} else if (tipoAdjunto.tipo_documento_id == 14) {
			dispatch(generateAutorizacionBancaria(oportunidad.id, onSuccess, indexGenerating));
		} else if (tipoAdjunto.tipo_documento_id == 21) {
			dispatch(generateAutorizacionRol(oportunidad.id, onSuccess, indexGenerating));
		} else if (tipoAdjunto.tipo_documento_id == 26) {
			dispatch(generateConsentimientoProteccionDatos(oportunidad.id, onSuccess, indexGenerating));
		}
		
	};

	const asignarActividad = () => {
		const onSuccess = () => {
			setActividadIdSelected();
			setOpenModalConfirm(false);
		};
		
		dispatch(
			asignarActividadOportunidad(
				{ id: idActividadSelected, oportunidad_id: oportunidad.id },
				onSuccess,
				enqueueSnackbar
			)
		);
	};

	//TODO: HACER QUE FUNCIONE PARA TODOS LOS FONDOS
	const getTotal = () => {
		if (oportunidad && oportunidad.aporte) {
			let _total = 0;

			let {
				monto_aporte,
				monto_aee,
				monto_soluciona,
				monto_itp,
				monto_prima,
				checkedAee,
				checkedSoluciona,
				checkedItp
			} = oportunidad.aporte;

			_total = (+monto_aporte || 0) + (+monto_prima || 0);

			if (checkedAee) {
				_total += +monto_aee || 0;
			}

			if (checkedSoluciona) {
				_total += +monto_soluciona || 0;
			}

			if (checkedItp) {
				_total += +monto_itp || 0;
			}

			return _total.toFixed(2);
		} else return 0;
	};

	const onCheckToSign = (archivo) => {
		let index = archivosAdjuntos.findIndex((archivoItem) => archivoItem.idAdjunto == archivo.idAdjunto);
		hasToSign[index] = !Boolean(hasToSign[index]);
		setHasToSign([...hasToSign]);
	};

	const handleStatus = (idStatus) => {
		const payload = {
			oportunidad_estado_id: idStatus, // CAMBIA ESTADO A FIRMAR
			oportunidad_id: idOportunidad,
			contenido: '',
			excepcion: ''
		};
		dispatch(postOportunidadTieneEstado(payload, enqueueSnackbar, () => { }));
	};



	const handleStatusSignedFiles = () => {
		const payload = { oportunidad_id: idOportunidad };

		const onSuccess = (nuevoEstado) => {			
			dispatch(getObtenerDocumentosOportunidad(idOportunidad));
			handleStatus(nuevoEstado);
		}

		dispatch(postOportunidadTieneEstadoSignedFiles(payload, enqueueSnackbar, onSuccess));
	};



	const handleSign = () => {

		const onSuccess = () => {
			handleStatus(1);
		};

		const onError = (e) => {

			if(e && e.message) {
				enqueueSnackbar('Ocurrió un error en el proceso de firma', {
					variant: 'error'
				});
				console.log(e);
			} else if(e && e.mensaje) {
				enqueueSnackbar(e.mensaje, {
					variant: 'warning'
				});
				console.log(e);
			}			
		};		

		dispatch(sendToSign({ oportunidad_id: oportunidad.id }, onSuccess, onError));
	};	

	const disabledVeriSign = (() => {

		if(_op && _op.estados) {
		
			let filtered = _op.estados.filter(estado=>estado.oportunidad_estado_id == 2);
	
			if(filtered.length > 0) {
				return true;
			}
		}

		return false;
	})();

	const fondo = (() => {
		if (oportunidad && oportunidad.fondo_id) {
			let fondo = fondoHorizonte.find((item) => item.codigo == oportunidad.fondo_id);

			if (fondo) return fondo;

			fondo = fondoInversion.find((item) => item.codigo == oportunidad.fondo_id);

			if (fondo) return fondo;
		} else if (codigoFondo) {
			let fondo = fondoHorizonte.find((item) => item.codigo == codigoFondo);

			if (fondo) return fondo;

			fondo = fondoInversion.find((item) => item.codigo == codigoFondo);

			if (fondo) return fondo;
		}

		return {};
	})();

	const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, numero_identificacion } = cliente;
	let nombre_cliente = (() => {
		let nombre = primer_nombre;

		if (segundo_nombre) {
			nombre += ' ' + segundo_nombre;
		}

		return nombre;
	})();

	let apellido_cliente = (() => {
		let apellido = primer_apellido;

		if (segundo_apellido) {
			apellido += ' ' + segundo_apellido;
		}

		return apellido;
	})();

	let numeroBeneficiarios = (() => {
		let numero = 0;

		if (!oportunidad || !oportunidad.id) return numero;

		numero += oportunidad.beneficiarios_seguro_vida.length;
		if (
			oportunidad.beneficiario_adicional &&
			oportunidad.beneficiario_adicional.nombre &&
			oportunidad.beneficiario_adicional.nombre.trim() != ''
		) {
			numero++;
		}

		return numero;
	})();

	let shouldShowValidateErrors = (() => {
		let { current_status } = _op;

		if (current_status && current_status.id == 13) {
			return true;
		}

		return false;
	})();
	
	const disableSendToSign = (() => {
		// return hasToSign.filter((item) => item).length == 0;

		let adjuntos = adjuntosCheckList.filter(adjunto => adjunto.requiere_firma);
		
		let countAdjuntosForSign = 0;
		adjuntos.forEach((adjunto) => {
			let indexArchivo = archivosAdjuntos.findIndex(
				(archivoAdjunto) =>
					archivoAdjunto.tipo_documento_id ==
					adjunto.tipo_documento_id
			);

			if(indexArchivo > -1) {
				countAdjuntosForSign++;
			}
		});

		return adjuntos.length > 0 && adjuntos.length != countAdjuntosForSign;

	})();

	const getSignStatus = () => {
        const { current_status } = _op;
        const oportunidad = _cliente && _cliente.Oportunidad;
        const regularizarEmpresa =
            oportunidad && oportunidad.regularizarEmpresa;

        let isJson = function(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        if (current_status && current_status.id) {
            if (
                current_status.oportunidad_estado_id == 13 &&
                regularizarEmpresa
            ) {
                let respuestaJson = current_status.respuesta_json;

                if (respuestaJson) {
                    if (respuestaJson[0] == '"')
                        respuestaJson = respuestaJson.substring(
                            1,
                            respuestaJson.length - 1
                        );
						
					// Escapar \	
					let find = '\\'.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
					let regex = new RegExp(find, 'g');
					
					respuestaJson = respuestaJson.replace(regex, '');

                    if (!isJson(respuestaJson)) return true;

                    respuestaJson = JSON.parse(respuestaJson);
                    let listadoErrores = respuestaJson.listadoErrores;

                    if (!listadoErrores) return true;

                    let total = listadoErrores.length;
                    let filtered = listadoErrores.filter(
                        err => err.codigoError == 'EIA000'
                    );
                    if (filtered.length == total) return false;
                }
            }

            if (current_status.oportunidad_estado_id == 3) {
                return false;
            }

            if (current_status.oportunidad_estado_id == 12) {
                return false;
            }
        }
        return true;
    };

	const hideSign = getSignStatus();

	let contChecklist = (()=>{
		
		if(oportunidad.fondo_id != '000001') {
			
			let adjuntosFilter = adjuntosCheckList.filter(item => item.tipo_documento_id != 12);
			let cont = adjuntosFilter.length;
			cont += numeroBeneficiarios;
	
			return cont;

		} else {
			return adjuntosCheckList.length;
		}
	})();

	const hasCompletedAttached = (() => {
		if (oportunidad.id && contChecklist == archivosAdjuntos.length) {
			return true;
		}

		return false;
	})();

	const canSendToAprobador = (() => {
		if(_op && _op.current_status && _op.current_status.oportunidad_estado_id
			&& _op.current_status.oportunidad_estado_id == 2) {
		
			let filtered = _op.estados.filter(estado=>estado.codigo == 'error');
	
			if(filtered.length == 0) {
				return hasCompletedAttached;
			}
		} else if(_op && _op.current_status && _op.current_status.oportunidad_estado_id
			&& (_op.current_status.oportunidad_estado_id == 17)) {
				return hasCompletedAttached;
		}


		return false;
	})();

	const canSendToAlta = (() => {
		if(_op && _op.current_status && _op.current_status.oportunidad_estado_id
			&& (_op.current_status.oportunidad_estado_id == 16 || _op.current_status.oportunidad_estado_id == 6)) {
				
				return true;
		}

		return false;
	})();

	return (
		<Fragment>
			<Box m={3}>
				<HeaderBreakcumbs
					route="/afp/ventas"
					routename1="Ventas"
					routename2="Mantenimiento de la oportunidad"
				// handleDelete={handleDelete}
				/>
			</Box>
			<Page className={classes.root} title="Mantenimiento oportunidad">
				<Container maxWidth="lg">
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Card>
								<CardHeader
									className={classes.TitleCard}
									title="Cliente"
									action={
										!loadingCliente &&
										!loadingOportunidad && (
											<Grid container direction="row" spacing={2}>
												<Grid item>
													<Link
														exact
														to={`/afp/clientes/editar/${cliente.id}/?codigoFondo=${(() => {
															let codigo = fondo.codigo;
															if (!codigo) codigo = oportunidad.fondo_id;

															return codigo;
														})()}`}
														component={RouterLink}
													>
														<Button
															variant="contained"
															size="small"
															style={{ background: 'black', color: 'white' }}
															startIcon={<EditIcon />}
														>
															EDITAR
														</Button>
													</Link>
												</Grid>

												<Grid item>
													<Link
														exact
														// to={`/afp/clientes/editar/${cliente.id}${mode == EDITAR
														// 	? '?source=' + EDITAR
														// 	: ''}`}
														onClick={() => setOpenModalActividades(true)}
														component={RouterLink}
													>
														<Button
															variant="contained"
															size="small"
															style={{ background: 'black', color: 'white' }}
															startIcon={<ListIcon />}
														>
															ASIGNAR ACTIVIDAD
														</Button>
													</Link>
												</Grid>
											</Grid>
										)
									}
								/>

								<Divider light={true} />

								<CardContent>
									{
										<Grid container direction="row" xs justify="space-between">
											<Grid item>
												<Grid container direction="row" spacing={3}>
													<Grid item>
														{loadingCliente || loadingOportunidad ? (
															<Skeleton
																animation="wave"
																variant="circle"
																width={40}
																height={40}
															/>
														) : (
															<Avatar className={classes.avatar}>
																{getInitials(nombre_cliente, 1)}
																{getInitials(apellido_cliente, 1)}
															</Avatar>
														)}
													</Grid>
													<Grid item>
														{loadingCliente || loadingOportunidad ? (
															<div style={{ width: '10rem' }}>
																<Skeleton />
																{/* <Skeleton animation={false} /> */}
																<Skeleton animation="wave" />
															</div>
														) : (
															<Fragment>
																<Typography>
																	{nombre_cliente} {apellido_cliente}
																</Typography>
																<Typography color="textSecondary" gutterBottom>
																	{numero_identificacion}
																</Typography>
															</Fragment>
														)}
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									}
								</CardContent>
							</Card>
						</Grid>

						<Grid item xs={12}>
							<OportunidadesEstado fondo={fondo} />
						</Grid>

						{shouldShowValidateErrors &&
							(<Grid item xs={12}>
								<OportunidadAltaErrors />
							</Grid>
							)}

						<Grid item md={6} xs={12}>
							{/* <Box className={classes.oportunidadInfo} m={2}> */}
							<Card>
								<CardHeader className={classes.TitleCard} title={fondo.contenido || ''} />
								<Divider light={true} />
								{loadingOportunidad ? (
									<CircularProgress />
								) : (
									<React.Fragment>
										<List component="nav" aria-label="main mailbox folders" style={{ padding: 0 }}>
											<ListItemText className={classes.TitleList}>
												<AttachMoneyIcon /> Total: {getTotal()}
											</ListItemText>
											<Divider light={true} />
											<ListItemText className={classes.TitleList}>
												<PeopleIcon /> Beneficiario(s): {numeroBeneficiarios}
											</ListItemText>

											<Divider light={true} />
											{fondo.codigo == '000001' && (
												<ListItemText className={classes.TitleList}>
													<PaymentIcon /> Forma de pago:{' '}
													{oportunidad &&
														oportunidad.aporte &&
														oportunidad.aporte.sistema_aporte &&
														oportunidad.aporte.sistema_aporte.contenido}
													{oportunidad &&
														oportunidad.aporte &&
														oportunidad.aporte.es_cuenta_tercero == 1 &&
														' (Cuenta de tercero)'}
												</ListItemText>
											)}
											<Divider light={true} />
										</List>

										<CardActions>
											<Link onClick={!_op.locked && handleCrearEditar} component={RouterLink}>
												<Button
													disabled={_op.locked}
													size="small"
													variant="contained"
													className={classes.ButtonCrearFondo}
													startIcon={<EditIcon />}
												// onClick={handleEditAporte}
												>
													{mode == CREAR ? 'Crear' : 'Editar'}
												</Button>
											</Link>{' '}

										</CardActions>
									</React.Fragment>
								)}
							</Card>
							{/* </Box> */}
						</Grid>
						<Grid item md={6} xs={12}>
							{/* <Box className={classes.oportunidadInfo} m={2}> */}



							<Card>

								<CardHeader
									className={classes.TitleCard}
									title="FORMATOS"
									action={<>									
										 {
											canSendToAprobador
											&&
											<Tooltip title="Pre operación" aria-label="Pre operación" style={{ color: red[500] }}>
												<IconButton
													size="small"
													onClick={() => handleStatus(4)}
													aria-label="settings"
												>
													{!_op.loading ? <UploadIcon /> : <CircularProgress size={20} />}
												</IconButton>
											</Tooltip>
										 }
										 {
											canSendToAlta
											&&
											<Tooltip title="Pre alta" aria-label="Pre alta" style={{ color: red[500] }}>
												<IconButton
													size="small"
													onClick={() => handleStatus(4)}
													aria-label="settings"
												>
													{!_op.loading ? <UploadIcon /> : <CircularProgress size={20} />}
												</IconButton>
											</Tooltip>
										}
										{' '}
									{
											(_op && _op.current_status && _op.current_status.id) &&
											(_op.current_status.oportunidad_estado_id == 1 || _op.current_status.oportunidad_estado_id == 3) &&
												<Tooltip title="Actualizar firma" aria-label="Actualizar firma">
													<IconButton
														size="small"
														disabled={disabledVeriSign}
														onClick={handleStatusSignedFiles} aria-label="Actualizar firma"
													>
														{!_op.loading ? <Replay /> : <CircularProgress size={20} />}
													</IconButton>
												</Tooltip>
										}
										{' '}
										{
											!hideSign && 
											<Tooltip title="Envío firma" aria-label="Envío firma" >
												<IconButton onClick={handleSign} size="small" disabled={disableSendToSign}>
													{
														!loadingSign
															? <SvgIcon>
																<SignatureIcon />
															</SvgIcon>
	
															: <CircularProgress style={{ margin: 'auto' }} size={20} />
													}
												</IconButton>
											</Tooltip>
										}
										{' '}
										{!_op.loading &&
											<Chip
												style={{ color: hasCompletedAttached ? green[400] : amber[300] }}
												// size="small"
												// color="primary"
												icon={<AttachFileIcon fontSize="small" style={{ color: hasCompletedAttached ? green[400] : amber[200] }} />}
												label={archivosAdjuntos.length + '/' + contChecklist}
												// onClick={handleClick}
												onDelete={() => { }}
												deleteIcon={hasCompletedAttached ? <DoneIcon style={{ color: green[400] }} /> : <WarnIcon style={{ color: amber[200] }} />}
												variant="outlined"
											/>}
									</>
									}

								/>
								<Divider light={true} />


								{

									adjuntosCheckList
										.filter(
											(adjunto) =>
												// SON LOS IDS DE LOS DOCUMENTOS QUE SE AUTOGENERAN
												adjunto.es_autogenerado
										)
										.map((adjunto, index) => {
											let indexArchivo = archivosAdjuntos.findIndex(
												(archivoAdjunto) =>
													archivoAdjunto.tipo_documento_id ==
													adjunto.tipo_documento_id
											);

											let archivoAdjunto = archivosAdjuntos[indexArchivo];

											return (
												<AdjuntoItem
													key={adjunto.id}
													{...{
														classes,
														adjunto,
														archivoAdjunto,
														openBase64InNewTab,
														handleOpenModal,
														isGenerateContrato: true,
														generateContrato: () => generateDocument(index),
														loadingGenerate: loadingGenerate[index],
														isCheckedToSign: hasToSign[indexArchivo],
														onCheckToSign
													}}
												/>
											);
										})}
								<CardHeader
									className={classes.TitleCard}
									title="DOCUMENTOS"
								/>
								<Divider light={true} />


								{
									loadingCliente || loadingOportunidad || adjuntosLoading ? (<CircularProgress />)
										: <List component="nav" aria-label="main mailbox folders" style={{ padding: 0 }}>

											{
												adjuntosCheckList
													.filter((adjunto) => !adjunto.es_autogenerado)
													.map((adjunto, index) => {

														if (
															adjunto.tipo_documento_id == 12 &&
															oportunidad &&
															oportunidad.beneficiarios_seguro_vida
														) {															

															return oportunidad.beneficiarios_seguro_vida.map(
																(beneficiario) => {

																	let indexArchivo = archivosAdjuntos.findIndex(
																		(archivoAdjunto) =>
																			archivoAdjunto.beneficiario_id ==
																			beneficiario.id
																	);

																	let archivoAdjunto = archivosAdjuntos[indexArchivo];

																	return (
																	<AdjuntoItem
																		key={adjunto.id}
																		{...{
																			classes,
																			adjunto,
																			archivoAdjunto,
																			openBase64InNewTab,
																			handleOpenModal,
																			beneficiario,
																			isCheckedToSign: hasToSign[index],
																			onCheckToSign
																		}}
																	/>
																)}
															);
														} else if (
															adjunto.tipo_documento_id == 13 &&
															oportunidad &&
															oportunidad.beneficiario_adicional
														) {															

															let indexArchivo = archivosAdjuntos.findIndex(
																(archivoAdjunto) =>
																	archivoAdjunto.beneficiario_id ==
																	oportunidad.beneficiario_adicional.id
															);

															let archivoAdjunto = archivosAdjuntos[indexArchivo];

															return (
																<AdjuntoItem
																	key={adjunto.id}
																	{...{
																		classes,
																		adjunto,
																		archivoAdjunto,
																		openBase64InNewTab,
																		handleOpenModal,
																		beneficiario: oportunidad.beneficiario_adicional,
																		isCheckedToSign: hasToSign[indexArchivo],
																		onCheckToSign
																	}}
																/>
															);
														} else {
															
															let indexArchivo = archivosAdjuntos.findIndex(
																(archivoAdjunto) =>
																	archivoAdjunto.tipo_documento_id ==
																	adjunto.tipo_documento_id
															);

															let archivoAdjunto = archivosAdjuntos[indexArchivo];

															return (
																<AdjuntoItem
																	key={adjunto.id}
																	{...{
																		classes,
																		adjunto,
																		archivoAdjunto,
																		openBase64InNewTab,
																		handleOpenModal,
																		isCheckedToSign: hasToSign[indexArchivo],
																		onCheckToSign
																	}}
																/>
															);
														}															
													})
											}

										</List>


								}

							</Card>



						</Grid>
					</Grid>
				</Container>
			</Page>
			{adjuntoToUpload && renderModalUploadImage()}
			{openModalActividades && (
				<ModalActividades
					openModal={openModalActividades}
					setOpenModal={setOpenModalActividades}
					actividad={_actividad}
					catalogo={_catalogo}
					catalogoOrigen={_catalogoOrigen}
					onActividadSelected={(actividad) => {

						let { id: idActividad } = actividad;

						setActividadIdSelected(idActividad);
						setOpenModalConfirm(true);
					}}
					_cliente={_cliente}
				/>
			)}
			{idActividadSelected && (
				<ModalConfirmacion
					openModal={openModalConfirm}
					setOpenModal={setOpenModalConfirm}
					onConfirm={asignarActividad}
					loading={loadingForm}
				/>
			)}
			{/* <ModalConfirmacion openModal={openModalConfirm} setOpenModal={setOpenModalConfirm} /> */}
		</Fragment>
	);
};

export default MaintenanceOportunity;

const AdjuntoItem = ({
	classes,
	adjunto,
	archivoAdjunto,
	openBase64InNewTab,
	handleOpenModal,
	beneficiario,
	isGenerateContrato = false,
	generateContrato,
	loadingGenerate,
	isCheckedToSign = false,
	onCheckToSign
}) => {
	if (beneficiario && archivoAdjunto && beneficiario.id != archivoAdjunto.beneficiario_id) {
		archivoAdjunto = null;
	}



	const hanldleDownload=(file, name)=>{
		
		
				
			const type = blobToType(file);

			const fileURL = blobToUrl(file);
			
			urlDownload(fileURL, name+"."+type);
			
			}


	return (
        <Fragment>
            <ListItemText>
                <Grid container>
                    <Grid
                        item
                        xs={9}
                        justify="flex-start"
                    >
                        <ListItemText className={classes.TitleList}>
                            {archivoAdjunto ? (
                                <Fragment>
                                    <CheckIcon style={{ color: 'green' }} />
                                    <a
                                        href="javascript:;"
                                        onClick={() => hanldleDownload(archivoAdjunto.archivo.archivo, adjunto.nombre) }
                                    >
                                        {!beneficiario
                                            ? adjunto.nombre
                                            : adjunto.nombre +
                                              ' - ' +
                                              beneficiario.nombre +
                                              ' ' +
                                              beneficiario.apellido}
                                    </a>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <AttachFileIcon />
                                    {!beneficiario
                                        ? adjunto.nombre
                                        : adjunto.nombre +
                                          ' - ' +
                                          beneficiario.nombre +
                                          ' ' +
                                          beneficiario.apellido}
                                </Fragment>
                            )}
                        </ListItemText>
                    </Grid>
                    {adjunto.estado != 'Aceptado' && (
                        <Grid item xs={3} justify="flex-end">
                            {isGenerateContrato ? (
                                <Fragment>
                                    {loadingGenerate ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            style={{
                                                background: 'black',
                                                color: 'white',
                                                marginRight: '10px'
                                            }}
                                            startIcon={<CloudDownloadIcon />}
                                            onClick={generateContrato}
                                        >
                                            Generar
                                        </Button>
                                    )}
                                </Fragment>
                            ) : (
                                <Button
                                    variant="contained"
                                    size="small"
                                    style={{
                                        background: 'black',
                                        color: 'white',
                                        marginRight: '10px'
                                    }}
                                    startIcon={<CloudUploadIcon />}
                                    onClick={() =>
                                        handleOpenModal(adjunto, archivoAdjunto, beneficiario)
                                    }
                                >
                                    {archivoAdjunto ? 'UPDATE' : 'UPLOAD'}
                                </Button>
                            )}
                        </Grid>
                    )}
                    {adjunto.requerido && !archivoAdjunto && (
                        <Grid item xs={12} justify="flex-start">
                            <ListItemText className={classes.TitleList}>
                                Este documento es requerido / obligatorio
                            </ListItemText>
                        </Grid>
                    )}
                    {adjunto.estado && adjunto.estado != 'Pendiente' && (
                        <Grid item xs={12} justify="flex-start">
                            <ListItemText className={classes.TitleList}>
                                El documento ha sido enviado a firmar
                            </ListItemText>
                        </Grid>
                    )}
                </Grid>
            </ListItemText>
            <Divider light={true} />
        </Fragment>
    );
};

const filterActividades=(data, cliente)=>{

	const datosCliente = cliente.ConsultarData;
	const {primer_apellido, segundo_apellido, primer_nombre, segundo_nombre} =datosCliente;

	
	const filterVideo =[];
	data.forEach(item => {
		if(item.actividad_id===1010 || item.actividad_id === 1012 ){
			filterVideo.push(item);
		}
	});

	const filterName =[];
	filterVideo.forEach(item => {
		const nombre_cliente = (item.prospecto.nombre_cliente).toUpperCase();
		const apellido_cliente = (item.prospecto.apellido_cliente).toUpperCase();
		

		if(
			
			apellido_cliente.includes(primer_apellido.toUpperCase())||
			apellido_cliente.includes(segundo_apellido.toUpperCase())||
			nombre_cliente.includes(primer_nombre.toUpperCase())||
			nombre_cliente.includes(segundo_nombre.toUpperCase())

			
		){
			filterName.push(item);
		}
	});








	return filterName;

}

const ModalActividades = ({ actividad, catalogo, catalogoOrigen, openModal, setOpenModal, onActividadSelected, _cliente }) => {
	return (
		<Modal
			open={openModal}
			onClose={() => setOpenModal(false)}
			style={{ width: '80%', height: '80%', minHeight: '400px', margin: 'auto' }}
		>
			<Card>
				<CardHeader
					title={'Elige una actividad'}
					action={
						<IconButton onClick={() => setOpenModal(false)}>
							<CancelIcon color="gray" />
						</IconButton>
					}
				/>
				<hr />
				<CardContent>
					<Paper style={{ margin: '1em 0' }}>
						<ActividadGrid
							data={filterActividades(actividad.actividades, _cliente)}
							catalogoActividades={catalogo.actividades}
							catalogoOrigen={catalogoOrigen}
							onActividadSelected={onActividadSelected}
						/>
					</Paper>
				</CardContent>
			</Card>
		</Modal>
	);
};

const ModalConfirmacion = ({ openModal, setOpenModal, onConfirm, loading }) => {
	return (
		<Dialog
			open={openModal}
			onClose={() => setOpenModal(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{'Elegir actividad'}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					¿Estás seguro de elegir esta actividad
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				{loading ? (
					<CircularProgress size={20} />
				) : (
					<Fragment>
						<Button onClick={() => setOpenModal(false)} color="primary">
							No
						</Button>
						<Button onClick={onConfirm} color="primary" autoFocus>
							Sí
						</Button>
					</Fragment>
				)}
			</DialogActions>
		</Dialog>
	);
};
