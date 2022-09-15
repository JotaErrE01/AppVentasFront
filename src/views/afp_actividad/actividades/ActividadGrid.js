import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Link as RouterLink } from 'react-router-dom';

import _ from 'lodash';
import { parseISO, format } from 'date-fns';
import { Button, IconButton } from '@material-ui/core';
import {
    PhoneCall as PhoneCallIcon,
    Calendar as CalendarIcon,
    Video as VideoIcon
} from 'react-feather'
import { useHistory } from 'react-router';
import { VideoCallOutlined } from '@material-ui/icons';
import dayjs from 'dayjs';
import { DEFAULT_LOCALE_TEXT } from 'src/utils/localeText';



const parseActividades = (catalogoActividades, catalogoOrigen, data) => {

    

    return data.map(item => {

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
    }
    )
}


export default function ActividadGrid({

    setEdit,

    catalogoActividades,
    catalogoOrigen,
    data,
    loading

}) {


    const history = useHistory();

    const config = {
        columns: [
            { field: 'cliente', headerName: 'Contacto', width: 180 },
            {
                field: 'actions',
                headerName: 'evento',
                renderCell: (params) => {
                    const { hash, actividad, celular } = params.value;
                    const phone = celular ? celular : '0'

                    if (actividad == 1011 || actividad === 1013) {
                        return <RouterLink to={'/call/' + hash + '/' + phone} target="_blank">
                            <IconButton>
                                <PhoneCallIcon />
                            </IconButton>
                        </RouterLink>
                    } else if (actividad == 1010 || actividad == 1012) {
                        return <RouterLink to={'/meet/' + hash} target="_blank">
                            <IconButton onClick={() => history.push('/afp/crm/oportunidad/opciones')}>
                                <VideoIcon />
                            </IconButton>
                        </RouterLink>
                    } else {
                        return <></>
                    }
                }
            },
            { field: 'proxima_reunion', headerName: 'día del evento', type: 'dateTime', width: 200 },
            { field: 'created_at', headerName: 'se registró', type: 'dateTime', width: 200 },
            { field: 'updated_at', headerName: 'se editó', type: 'dateTime', width: 200 },


            // { field: 'actividad', headerName: 'Actividad', width: 180 },
            { field: 'origen', headerName: 'Origen', width: 180 },
            { field: 'correo', headerName: 'Correo', width: 210 },
            { field: 'celular', headerName: 'Celular', width: 120 },
            { field: 'tipo', headerName: 'Tipo', width: 120 },

            { field: 'identificacion', headerName: 'Identificación', width: 150 },


        ],
        rows: parseActividades(catalogoActividades, catalogoOrigen, data),
        sortModel: [
            {
                field: 'proxima_reunion',
                sort: 'desc',
                type: 'date'
            },
        ]
    }






    return (
        <div style={{ height: '50vh', width: '100%' }}>
            <DataGrid
            loading={loading}
                rows={config.rows}
                columns={config.columns}
                sortModel={config.sortModel}
                pageSize={10}
                // onSelectionChange={(newSelection) => {
                //     setEdit(newSelection.rowIds[0]);
                // }}
                onRowSelected={
                    ({data}) => {
                        data.actividad == "LLAMADA TELEFONICA" &&  setEdit(data.id);

                    }
                }
                localeText={DEFAULT_LOCALE_TEXT}
            />

        </div>
    );
}
