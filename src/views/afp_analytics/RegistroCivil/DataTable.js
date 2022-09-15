import * as React from 'react';
import { DataGrid  } from '@material-ui/data-grid';
import { format, formatDistance, formatRelative, parse, subDays } from 'date-fns'
import { es } from 'date-fns/locale';
import { Grid, Typography } from '@material-ui/core';




export default function DataTable({
    data,
    loading,
    dateFormat
}) {


    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90,
            hide: true
        },
   
        {
            field: 'fecha',
            headerName: 'Fecha',
            sortable: false,
            width: 130,
            hide: !dateFormat,
            valueGetter: (params) => {
                let date = params.row.created_at ;
                date = format(new Date(date), dateFormat, { locale: es });
                return date.toUpperCase();
            }
        },

        {
            field: 'cantidad',
            headerName: 'Cant.',
            sortable: false,
            width: 90,
            hide: (params) => {
                console.log(params)
                const cantidad = params.row.cantidad;
                return !cantidad;
            }
        },
        {
            field: 'hora',
            headerName: 'Hora',
            sortable: false,
            width: 90,
            hide: !dateFormat,
            valueGetter: (params) => {
                const date = params.row.created_at;
                return format(new Date(date), "HH:mm aaa")
            }
        },
        {
            field: 'cedula',
            headerName: 'cedula',
            width: 200,
            valueGetter: (params) => {
                return  params.row.numero_identificacion;
            }
        },

        {
            field: 'api_endpoint',
            headerName: 'API',
            width: 150,
        },

   


        //   {
        //     field: 'params',
        //     headerName: 'params',
        //     width: 150,
        //     editable: true,
        //   },
        //   {
        //     field: 'body',
        //     headerName: 'body',
        //     width: 150,
        //     editable: true,
        //   },
        {
            field: 'name',
            headerName: 'Usuario',
            width: 300,
            editable: true,
        },
        {
            field: 'descripcion_localidad',
            headerName: 'Localidad',
            width: 210,
            editable: true,
        },
        {
            field: 'descripcion_cargo',
            headerName: 'Cargo',
            width: 210,
            editable: true,
        },
        // {
        //     field: 'nombre_jefe',
        //     headerName: 'Jefe',
        //     width: 150,
        //     editable: true,
        // },
        //   {
        //     field: 'lastName',
        //     headerName: 'Last name',
        //     width: 150,
        //     editable: true,
        //   },
        //   {
        //     field: 'age',
        //     headerName: 'Age',
        //     type: 'number',
        //     width: 110,
        //     editable: true,
        //   },
        //   {
        //     field: 'fullName',
        //     headerName: 'Full name',
        //     description: 'This column has a value getter and is not sortable.',
        //     sortable: false,
        //     width: 160,
        //     valueGetter: (params) =>
        //       `${params.getValue(params.id, 'firstName') || ''} ${
        //         params.getValue(params.id, 'lastName') || ''
        //       }`,
        //   },
    ];

    let total = 0;
    data.forEach(item => {
        const add = item.cantidad ? parseInt(item.cantidad) : 1;
        total = total + add;
    });

    if(loading){
        return <p> cargando ...</p>
    }


    return (
        <div>
            <DataGrid
                loading={loading}
                density='compact'
                rows={data}
                columns={columns}
                checkboxSelection={false}
                disableSelectionOnClick
                autoHeight
            />

            <Grid container direction="row" justifyContent="flex-end">   
            
                <Grid item justifyContent='flex-end'>
                    <Typography variant="h6">Total: {total}</Typography>
                </Grid>
            </Grid>

        </div>
    );
}