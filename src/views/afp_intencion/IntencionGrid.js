import { DataGrid } from '@material-ui/data-grid'
import dayjs from 'dayjs';
import React from 'react'
import JSONTree from 'react-json-tree'
import { makeStyles } from '@material-ui/core'
import { DEFAULT_LOCALE_TEXT } from 'src/utils/localeText';

const useStyles = makeStyles((theme) => ({
    grid: {
        backgroundColor: 'red',
        height: '100vh'
    }
}));

const IntencionGrid = ({ data, loading, setGrabbed }) => {


    const classes = useStyles();

    const sortModel = [
        { field: 'sort_creado', sort: 'desc', type: 'date' },
    ];


    const rows = data.map(item => {

        let created = dayjs(item.intencion_created_at).format('YYYY/MM/DD');
        let updated = dayjs(item.intencion_updated_at).format('YYYY/MM/DD');
        let sort_creado = dayjs(item.intencion_created_at)

        const payload = {

            id: item.id || '',
            fases_id: item.fases_id || '',
            prospecto_id: item.prospecto_id || '',
            intencion_created_at: created,

            sort_creado: sort_creado,


            // intencion_updated_at: updated,
            intencion_estado: item.intencion_estado,

            fases_order: item.fases_order || '',
            fases_title: item.fases_title || '',

            call_count: item.call_count ||0,
            video_count: item.video_count ||0,



            prospecto_nombres: item.prospecto_nombres || '',
            prospecto_numero_identificacion: item.prospecto_numero_identificacion || '',
            prospecto_correo_cliente: item.prospecto_correo_cliente || '',
        
            celular_cliente: item.prospecto_celular_cliente,
            contacto_1: item.prospecto_contacto_1,
            contacto_2: item.prospecto_contacto_2,
            contacto_3: item.prospecto_contacto_3,
            contacto_adicional: item.prospecto_contacto_adicional,

        }

        return payload;

    });


    const columns = [
        { field: 'id', headerName: 'id', hide: true },
        { field: 'fases_id', headerName: 'fases_id', hide: true },
        { field: 'prospecto_id', headerName: 'prospecto_idprospecto_id', hide: true },
        { field: 'sort_creado', headerName: 'sort_creado', width: 200 , hide: true },



        { field: 'intencion_created_at', headerName: 'Creado', width: 125 },

        // { field: 'intencion_updated_at', headerName: 'Editado', width: 125 },
        { field: 'intencion_estado', headerName: 'status', width: 125 },


        { field: 'fases_order', headerName: 'fases_order', hide: true },
        { field: 'fases_title', headerName: 'Fase', width: 125 },

        { field: 'call_count', headerName: '# llamadas',  width: 125 },
        { field: 'video_count', headerName: '# videos', width: 125 },



        { field: 'prospecto_nombres', headerName: 'Nombres', width: 300 },
        { field: 'prospecto_numero_identificacion', headerName: 'Identificación', width: 125 },
        { field: 'prospecto_correo_cliente', headerName: 'Correo', width: 250 },

    
        

        { field: 'contacto_1', headerName: 'contacto 1', width: 150, editable: true },
        { field: 'contacto_2', headerName: 'contacto 2', width: 150, editable: true },
        { field: 'contacto_3', headerName: 'contacto 3', width: 150, editable: true },
        { field: 'contacto_adicional', headerName: 'contacto_adicional', width: 200,},
        { field: 'celular_cliente', headerName: 'celular', width: 150, editable: true },

    ];




    const onCellClick = (event) => {

        
        const { id, field, value } = event;



        const _data = data.find(item=> item.id == id);


        let calling;

        if (   
                field=== "celular_cliente"
            || field=== "contacto_1"
            || field=== "contacto_2"
            || field===  "contacto_3"
            || field===  "contacto_adicional"

        ) {
            calling = value;
        } else {            
            calling = 
            _data.prospecto_celular_cliente ? _data.prospecto_celular_cliente :
            _data.prospecto_contacto_1 ?  _data.prospecto_contacto_1 :
            _data.prospecto_contacto_2 ?  _data.prospecto_contacto_2 :
            _data.prospecto_contacto_3 ? _data.prospecto_contacto_3  :
            _data.prospecto_contacto_adicional ? _data.prospecto_contacto_adicional  :

            null;
        }
        setGrabbed({ 
            ..._data,
            calling
        
        })


    }

 


    return (
        <div style={{ height: 520, width: '100%' }}>

            <DataGrid

                localeText={DEFAULT_LOCALE_TEXT}
				rowHeight={33}

                rows={rows}
                columns={columns}
                sortModel={sortModel}
                onCellClick={onCellClick}
            />
        </div>
    )
}







export default IntencionGrid
