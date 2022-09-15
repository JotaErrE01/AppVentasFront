import React from 'react'


//HELPERSS
import _ from 'lodash';
import { parseISO, format } from 'date-fns';
import dayjs from 'dayjs';

import { DataGrid, Button, IconButton } from '@material-ui/data-grid';

//ROUTES
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import { DEFAULT_LOCALE_TEXT } from 'src/utils/localeText';


function  parseProspecto (data) {
    const rows = data.map(item => {

       let updated = dayjs(item.updated_at).format('YYYY/MM/DD');

       

        return  (
            {
                id: item.id,
                updated_at:updated ,
                nombres: `${item.nombre_cliente} ${item.apellido_cliente}`,
                correo_cliente: item.correo_cliente,
                numero_identificacion: item.numero_identificacion,
                celular_cliente: item.celular_cliente,

                //HIJO
                origen_id: item.origen.id ||'',
                origen_codigo: item.origen.codigo ||'',
                origen_contenido: item.origen.contenido ||'',

                //MAESTRO
                origen_cat_id: item.origen.cat_id ||'',
                origen_cat_descripcion: item.origen.cat_descripcion ||'',
            }
        )
    }




    );

    const columns = [
        { field: 'updated_at', headerName: 'Actualización', width: 180 },
        { field: 'nombres', headerName: 'Nombres', width: 180 },
        { field: 'correo_cliente', headerName: 'Correo', width: 210 },
        { field: 'celular_cliente', headerName: 'Celular', width: 180 },
        { field: 'numero_identificacion', headerName: 'Identificación', width: 180 },
        { field: 'origen_contenido', headerName: 'Origen', width: 270 }
    ];

    return { rows, columns }
}


const ProspectoGrid = ({ data, loading,  setEdit }) => {

    const history = useHistory();

    const { rows, columns } = parseProspecto(data);

    const sortModel = [
        {
            field: 'updated_at',
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
                sortModel={sortModel}
                localeText={DEFAULT_LOCALE_TEXT}
                onSelectionChange={ (newSelection)=>{
                    setEdit(newSelection.rowIds[0]);
                }}
                onRowSelected={
                    ({data}) => {
                        setEdit(data.id);
                    }
                }
                loading={loading}
            />
        </div>
    )
}

export default ProspectoGrid
