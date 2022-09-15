import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Link as RouterLink } from 'react-router-dom';

import _ from 'lodash';
import { parseISO, format } from 'date-fns';
import { Button, IconButton } from '@material-ui/core';
import {
	PhoneCall as PhoneCallIcon,
	Calendar as CalendarIcon,
	Video as VideoIcon,
	Check as CheckIcon
} from 'react-feather';
import { useHistory } from 'react-router';
import { VideoCallOutlined } from '@material-ui/icons';
import dayjs from 'dayjs';

const castDateToText = (date) => {
	return format(parseISO(date), 'dd/MM/yyyy HH:mm ');
};


const parseActividades = (catalogoActividades, catalogoOrigen, data) => {

	
	return data.map((item) => {

		const propsecto = item.prospecto || {
            numero_identificacion: '',
            nombre_cliente: 'No asignado',
            apellido_cliente: '',
            origen_id: '',
            correo_cliente: null,
            celular_cliente: ''
        };

        const actividad = _.find(catalogoActividades, { 'id': item.actividad_id });
        const origen = _.find(catalogoOrigen, { 'id': propsecto.origen_id });
		
        const meet = item.meet;



        const updated_at = dayjs(item.updated_at).toDate();
        const created_at = dayjs(item.created_at).toDate();
        const proxima_reunion = dayjs(meet.datetime).toDate();

        return ({
            id: item.id,
            identificacion: propsecto.numero_identificacion,
            cliente: `${propsecto.nombre_cliente} ${propsecto.apellido_cliente}`,
            tipo: 'Prospecto',
            correo: propsecto.correo_cliente,
            celular: propsecto.celular_cliente || meet.celular_cliente,
            proxima_reunion: proxima_reunion,
            created_at: created_at,

            updated_at: updated_at,
            origen: origen && origen.contenido,
            actividad: actividad.contenido || '',
            //ccusstom render
            actions: {
                hash: item.contenido_3,
                actividad: actividad.id,
                celular: propsecto.celular_cliente || meet.celular_cliente,
            }

        })
	});
};

export default function ActividadGrid({ catalogoActividades, catalogoOrigen, data, onActividadSelected }) {
	const history = useHistory();

	const rows = parseActividades(catalogoActividades, catalogoOrigen, data);

	const columns = [
		// {
		// 	field: 'actions',
		// 	headerName: 'Elegir',
		// 	renderCell: (params) => {
		// 		return (
		// 			<IconButton onClick={() => onActividadSelected(params.row)}>
		// 				<CheckIcon />
		// 			</IconButton>
		// 		);
		// 	}
		// },

		{ field: 'created_at', headerName: 'Registrado', type: 'dateTime', width: 200 },


		{ field: 'proxima_reunion', headerName: 'Día del evento', type: 'dateTime', width: 200 },


		{ field: 'actividad', headerName: 'Actividad', width: 180 },
		{ field: 'cliente', headerName: 'Cliente', width: 180 },
		{ field: 'tipo', headerName: 'Tipo', width: 120 },
		{ field: 'origen', headerName: 'Origen', width: 180 },

		{ field: 'identificacion', headerName: 'Identificación', width: 150 },
		{ field: 'correo', headerName: 'Correo', width: 210 },
		{ field: 'celular', headerName: 'Celular', width: 120 },

		// {
		//     field: 'fullName',
		//     headerName: 'Full name',
		//     description: 'This column has a value getter and is not sortable.',
		//     sortable: false,
		//     width: 160,
		//     valueGetter: (params) =>
		//         `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
		// },
	];

	const sortModel = [
		{
			field: 'created_at',
			sort: 'desc',
			type: 'date'
		},
	];

	return (
		<div style={{ height: 600, width: '100%' }}>
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={10}
				onRowSelected={
					({data}) => onActividadSelected(data)
					
				}

				sortModel={sortModel}
			/>
		</div>
	);
}
