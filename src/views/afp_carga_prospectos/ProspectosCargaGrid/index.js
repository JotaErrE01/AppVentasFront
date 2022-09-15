import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import dayjs from 'dayjs';

import { DataGrid } from '@material-ui/data-grid';
import { DEFAULT_LOCALE_TEXT } from 'src/utils/localeText';
import { IconButton, Collapse, Box, Button, CardHeader, Grid, makeStyles } from '@material-ui/core';

import JSONTree from 'react-json-tree';
import ReactJson from 'react-json-view'
import { Alert } from '@material-ui/lab';
import { X } from 'react-feather';
import { toast } from 'react-toastify';
import { LockOpenRounded, LockRounded } from '@material-ui/icons';
import { palette } from 'src/theme';
import AsignacionModal from '../AsignacionModal';
import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';
import { getSubordinados } from 'src/slices/usuario';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from 'src/contextapi/hooks/useAuth';
import { getProspectosCarga, storeAsignacionSuffle } from 'src/slices/prospecto';


const parseData = (data) => {
	const rows = data.map((item) => {

		const hasOpenArr = item.intencion.filter(element => element.estado === "OPEN");
		const locked = hasOpenArr.length ? true : false;

		return {
			id: item.id,
			nombre_cliente: item.nombre_cliente,
			correo_cliente: item.correo_cliente,
			estado_prospecto: item.estado_prospecto,
			numero_identificacion: item.numero_identificacion,
			apellido_cliente: item.apellido_cliente,
			celular_cliente: item.celular_cliente,
			estado: item.estado,
			created_at: item.created_at,
			updated_at: item.updated_at,
			usuario_id: item.usuario_id,
			origen_id: item.origen_id,
			aporte: item.aporte,
			fecha_ult_aporte: item.fecha_ult_aporte,
			estado_cliente: item.estado_cliente,
			contacto_1: item.contacto_1,
			contacto_2: item.contacto_2,
			contacto_3: item.contacto_3,
			contacto_adicional: item.contacto_adicional,
			ruc: item.ruc,
			empresa: item.empresa,
			created_by_id: item.created_by_id,
			carga_id: item.carga_id,
			asigned_to_id: item.asigned_to_id,

			//CUSTOM
			asesor: item.usuario && item.usuario.id ? item.usuario.name : '-',
			origen: item.origen && item.origen.id ? item.origen.codigo : '-',
			isRowSelectable: false,
			locked: locked

		};
	});
	const columns = [
		// { field: "usuario_id", headerName: 'usuario_id', width: 120 },
		// { field: "estado_prospecto", headerName: 'estado_prospecto', width: 60 },
		// { field: "asigned_to_id", headerName: 'asigned_to_id', width: 120 },
		// { field: "created_by_id", headerName: 'created_by_id', width: 120 },
		// { field: "origen_id", headerName: 'origen_id', width: 120 },
		// { field: "carga_id", headerName: 'carga_id', width: 120 },
		// { field: "estado", headerName: 'estado', width: 120 },
		// { field: "id", headerName: 'id', width: 90 },

		{
			field: "locked", headerName: " ", width: 45,
			renderCell: ({ value }) => (
				value ? <LockRounded style={{ color: palette.error.main }} /> : <LockOpenRounded style={{ color: palette.success.main }} />

			)
		},





		{ field: "nombre_cliente", headerName: 'NOMBRES', width: 300 },
		{ field: "apellido_cliente", headerName: 'APELLIDOS', width: 300 },

		//CUSTOM
		{ field: "asesor", headerName: 'ASESOR ASIGNADO', width: 300 },
		//

		{ field: "correo_cliente", headerName: 'correo_cliente', width: 200 },
		{ field: "numero_identificacion", headerName: 'numero_identificacion', width: 180 },
		{ field: "created_at", headerName: 'creado', width: 150 },
		{ field: "updated_at", headerName: 'actualizado', width: 150 },

		{ field: "aporte", headerName: 'aporte', width: 120 },
		{ field: "fecha_ult_aporte", headerName: 'fecha_ult_aporte', width: 120 },
		{ field: "estado_cliente", headerName: 'estado_cliente', width: 120 },

		{ field: "celular_cliente", headerName: 'celular', width: 150, editable: true },
		{ field: "contacto_1", headerName: 'contacto_1', width: 150, editable: true },
		{ field: "contacto_2", headerName: 'contacto_2', width: 150, editable: true },
		{ field: "contacto_3", headerName: 'contacto_3', width: 150, editable: true },
		{ field: "contacto_adicional", headerName: 'contacto_adicional', width: 150, editable: true },

		{ field: "ruc", headerName: 'ruc', width: 200 },
		{ field: "empresa", headerName: 'empresa', width: 300 },

		//CUSTOM
		{ field: "origen", headerName: 'origen', width: 120 },


	];

	const sortModel = [{ field: 'updated_at', sort: 'desc', type: 'date' }];

	return { rows, columns, sortModel };
}

const ProspectosCargaGrid = ({
	title,
	data,
	loading,
	onEditCellChangeCommitted,
	log
}) => {





	const { rows, columns } = parseData(data);
	const [openLogs, setOpenLogs] = useState(false);


	//SELECCION UNO A UNO :: 
	/// PERMITE MARCARR AQUELLOS QUE ESTEN LIBRES
	const [selectionModel, setSelectionModel] = useState([]);
	const [isAsignar, setIsAsignar] = useState([]);
	const [isReAsignar, setIsReasignar] = useState([]);


	const _onSelectionChange = (payload) => {
		// vienen arreglo de ids
		// con el arreglo de ids busco los obejtos completos
		const _selection = rows.filter(item => payload.selectionModel.includes(item.id));

		// filtro los que estan librres
		const libres = _selection.filter(item => !(item.locked));
		const ocupados = _selection.filter(item => (item.locked));

		if (ocupados.length) toast.error('Uno o varios elementos se encuentran ocupados por otro asesor')



		const asignar = libres.filter(item => item.asigned_to_id === null);

		//aquellos que estan dessbloqueados y se pueden reasignarr
		const reasignar = libres.filter(item => item.asigned_to_id);

		let _selectionModel = libres.map(item => item.id);
			_selectionModel.sort();
		const _asignar = asignar.map(item => item.id);
		const _reasignar = reasignar.map(item => item.id);


		setIsAsignar(_asignar);
		setIsReasignar(_reasignar);
		setSelectionModel(_selectionModel);


	};








	//
	const [asignarModal, setAsignarModal] = useState(false);
	const [asignarType, setAsingarType] = useState(false);

	const { user } = useAuth();
	const { coreSalaArr } = useSelector((state) => state.coreSala);
	const userSala = coreSalaArr.find(item => item.host_id == user.id);
	const subsArr = userSala && userSala.users.length ? userSala.users.map(item => item.user) : [];


	const dispatch = useDispatch();

	const _onAsingar = (type) => {
		setAsingarType(type);
		setAsignarModal(true);
	}

	const _onAsingarLeave = () => {
		setAsingarType(false);
		setAsignarModal(false);
	}




	const fnAleatorio = () => {

		const props = asignarType === 'ASIGNAR'
			? {
				prospectos_ids: isAsignar.map(item => item.id),
				subordinados_ids: [],
				tipo_asignacion: asignarType
			}

			: {
				prospectos_ids: isReAsignar.map(item => item.id),
				subordinados_ids: [],
				tipo_asignacion: asignarType
			}


		return {
			title: `${asignarType} ALEATORIO `,
			buttonText: 'Distribuir',
			trigger: () => {
				console.log(props)
			}
		}
	}
	const fnManual = () => {
		const props = asignarType === 'ASIGNAR'
			? {
				prospectos_ids: isAsignar,
				subordinados_ids: [],
				tipo_asignacion: asignarType
			}

			: {
				prospectos_ids: isReAsignar,
				subordinados_ids: [],
				tipo_asignacion: asignarType
			}
		return {
			title: `${asignarType}`,
			buttonText: 'Distribuir',
			trigger: (usuarioSelected) => {
				const _props = {
					...props,
					subordinados_ids: [usuarioSelected]
				};

				
				dispatch(storeAsignacionSuffle(_props,() => dispatch(getProspectosCarga())))
			}
		}
	}





	return (
		<div>


			<div>
				<AsignacionModal
					open={asignarModal}
					onClose={_onAsingarLeave}


					subordinados={subsArr}
					fnAleatorio={fnAleatorio}
					fnManual={fnManual}

				>

				</AsignacionModal>
			</div>

			<div>
				<CardHeader
					action={
						<Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
							<Grid item>
								<Button
									onClick={() => { _onAsingar('REASIGNAR') }}
									aria-label="settings" color="secondary" variant="contained" disabled={!isReAsignar.length}>
									Reasignar {isReAsignar.length || ''}
								</Button>
							</Grid>
							<Grid item>
								<Button
									onClick={() => { _onAsingar('ASIGNAR') }}
									aria-label="settings" color="primary" variant="contained" disabled={!isAsignar.length}>
									Asignar {isAsignar.length || ''}
								</Button>
							</Grid>
						</Grid>
					}
					title={`CARGA ${title}`}

				/>
				{
					rows.length ?
						<div style={{ height: 480, width: '100%' }}>
							<DataGrid
								disableSelectionOnClick
								localeText={DEFAULT_LOCALE_TEXT}
								rows={rows}
								columns={columns}
								pageSize={10}
								rowHeight={33}


								// sortModel={sortModel}
								onEditCellChangeCommitted={onEditCellChangeCommitted}
								loading={loading}



								//SELECCION GRUPAL;
								checkboxSelection={true}
								onSelectionModelChange={_onSelectionChange}
								isRowSelectable={false}
								selectionModel={selectionModel}

							/>
						</div> : <></>
				}


				<Collapse in={!openLogs} timeout="auto" unmountOnExit>
					<Alert
						variant="outlined" severity="info"
						action={
							<Button color="inherit" size="small" onClick={() => setOpenLogs(!openLogs)}>
								Ver informe
							</Button>
						}
					>
						Resumen de carga
					</Alert>
				</Collapse>

				<Collapse in={openLogs} timeout="auto" unmountOnExit >

					<Box style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
						<ReactJson src={log} />
						<Box>
							<IconButton onClick={() => setOpenLogs(!openLogs)}>
								<X />
							</IconButton>
						</Box>
					</Box>
				
				</Collapse>

			</div>





		</div>
	);
};

export default ProspectosCargaGrid;


