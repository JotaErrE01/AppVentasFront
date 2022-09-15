import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { DataGrid } from '@material-ui/data-grid';
import { DEFAULT_LOCALE_TEXT } from 'src/utils/localeText';
import { Box, Button, Grid, IconButton, Typography } from '@material-ui/core';
import JSONTree from 'react-json-tree';
import useAuth from 'src/contextapi/hooks/useAuth';
import { Filter } from 'react-feather';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';




const parseData = (data, user) => {


    const rows = data.map((item) => {
        // let updated = dayjs(item.updated_at).format('YYYY/MM/DD');

        return {

            id: item.id,
            usuario_id: item.usuario && item.usuario.id,
            intencion: item.intencion && item.intencion.length ? true : false,

            origen_id: item.origen && item.origen.id,
            origen_name: item.origen ? item.origen.codigo : 'NO ASIGNADOO',


            nombre_cliente: item.nombre_cliente,
            correo_cliente: item.correo_cliente,
            apellido_cliente: item.apellido_cliente,
            numero_identificacion: item.numero_identificacion,

            celular_cliente: item.celular_cliente,
            contacto_1: item.contacto_1,
            contacto_2: item.contacto_2,
            contacto_3: item.contacto_3,
            contacto_adicional: item.contacto_adicional,
            created_at: dayjs(item.created_at).format('YYYY/MM/DD'),
            updated_at: dayjs(item.updated_at).format('YYYY/MM/DD'),
            fecha_ult_aporte: dayjs(item.fecha_ult_aporte).format('YYYY/MM/DD'),
            aporte: item.aporte,
            estado_cliente: item.estado_cliente,
            nombre_oficial: item.nombre_oficial,
            created_by_id: item.created_by_id,
            carga_id: item.carga_id


        };
    });

    const columns = [
        // { field: 'id', headerName: 'id', width: 90 },

        { field: 'nombre_cliente', headerName: 'nombre_cliente', width: 300, editable: true },
        { field: 'apellido_cliente', headerName: 'apellido_cliente', width: 300, editable: true },
        {
            field: 'intencion', headerName: 'LEAD', width: 150,
            renderCell: (params) =>
                <Box display="flex" justifyContent="flex-start" alignItems="center">
                    <Typography variant="h6">{params.value ? 'SI' : 'NO'}</Typography>
                </Box>
        },
        {
            field: 'created_by_id',
            headerName: 'Creado',
            width: 120,
            renderCell: (params) => {
                return params.value === user.id ?
                    <Typography variant="h6">Propio</Typography> :
                    <Typography variant="h6">Supervisor</Typography>
            }
        },
        { field: 'usuario_id', headerName: 'usuario_id', width: 120, hide: true },
        { field: 'origen_name', headerName: 'Orig.', width: 90 },
        { field: 'correo_cliente', headerName: 'correo', width: 300, editable: true },
        { field: 'numero_identificacion', headerName: 'numero_identificacion', width: 150, editable: true },
        { field: 'celular_cliente', headerName: 'celular', width: 150, editable: true },
        { field: 'contacto_1', headerName: 'contacto 1', width: 150, editable: true },
        { field: 'contacto_2', headerName: 'contacto 2', width: 150, editable: true },
        { field: 'contacto_3', headerName: 'contacto 3', width: 150, editable: true },
        { field: 'contacto_adicional', headerName: 'contacto_adicional', width: 150, editable: true },
        { field: "estado_cliente", headerName: 'estado_cliente', width: 300 },

        { field: 'created_at', headerName: 'created_at', width: 150 },
        { field: 'updated_at', headerName: 'updated_at', width: 150 },
        { field: 'fecha_ult_aporte', headerName: 'fecha_ult_aporte', width: 150 },
        { field: 'aporte', headerName: 'aporte', width: 150 },
        { field: 'carga_id', headerName: 'carga_id', width: 150 },

    ];

    const sortModel = [{
        field: 'created_at',
        sort: 'desc',
        type: 'date'
    }];

    return { rows, columns, sortModel };
}




const ProspectoGrid = ({

    data,
    loading,
    // onEditCellChangeCommitted,

    // EDIT
    onGrab,
    onGrabArr


}) => {
    const [selectionModel, setSelectionModel] = useState([]);


    const { user } = useAuth();
    const { rows, columns, sortModel } = parseData(data, user);



    const _onSelectionChange = (payload) => {
        const _selection = rows.filter(item => payload.selectionModel.includes(item.id));
        let _libres = _selection.filter(item => !(item.intencion));
        _libres = _libres.map(item => item.id);
        _libres.sort();
        setSelectionModel(_libres);
        onGrabArr(_libres)
    }



    return (
        <div style={{ height: 600, width: '100%' }}>

            {
                rows.length ?

                    <DataGrid
                        disableSelectionOnClick
                        localeText={DEFAULT_LOCALE_TEXT}
                        rows={rows}
                        columns={columns}
                        sortModel={sortModel}
                        pageSize={10}
                        rowHeight={33}

                        // onEditCellChangeCommitted={onEditCellChangeCommitted}
                        loading={loading}


                        onCellClick={(e) => (e.field !== "__check__") && onGrab(e.id)}

                        //SELECCION GRUPAL;

                        checkboxSelection={true}
                        onSelectionModelChange={(payload) => _onSelectionChange(payload)}
                        isRowSelectable={false}
                        selectionModel={selectionModel}
                    // onSelectionModelChange={(newSelection) => {
                    //     onGrabArr(selectionModel);
                    // }}
                    /> :

                    <> </>

            }

        </div>
    );
};

export default ProspectoGrid;
