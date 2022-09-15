import React from 'react';
import {
    DataGrid,

    GridToolbarContainer,
    GridToolbarExport,

} from '@material-ui/data-grid';
import { DEFAULT_LOCALE_TEXT } from 'src/utils/localeText';
import JSONTree from 'react-json-tree';
import { Box, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { getWeekOfMonth } from 'date-fns'

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}



function parseData(data) {

    if(data.length){
        
    }
    const rows = data.map((item) => {

        let match = item.int_created ? item.int_created.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/) : null;
        let date = match ? new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]) : null;
        let week =date ?  getWeekOfMonth(date) : '-'

        

        return {
            id: item.int_user_id,
            semana: week,
            int_created: item.int_created,
            int_edited: item.int_edited,
            int_user_id: item.int_user_id,
            int_user_name: item.int_user_name,
            phone_count:item.phone_count || 0,
            video_count: item.video_count  || 0,
            reach_count: item.clientes_contactados  || 0,

            prospecto: item.prospecto ||0,
            calificacion: item.calificacion||0,
            entrevista:item.entrevista||0,
            presentacion: item.presentacion||0,
            venta: item.venta||0,
            aprobado: item.venta_aprobada||0,
            ganado: item.ganado||0,
            recaudado: item.recaudado||0,
        };   
    });

    const columns = [
        
        { field: 'id', headerName: 'user', width: 50 },
        { field: 'semana', headerName: 'semana', width: 140 },

        { field: 'int_user_name', headerName: 'Oficial', width: 300 },

        { field: 'reach_count', headerName: '#gestionados', width: 150 },


        { field: 'phone_count', headerName: '#llamadas', width: 150 },
        { field: 'video_count', headerName: '#videos', width: 150 },
        
        { field: 'prospecto', headerName: 'prospecto', width: 140 },
        { field: 'calificacion', headerName: 'calificacion', width: 140 },
        { field: 'entervista', headerName: 'entervista', width: 140 },

        { field: 'presentacion', headerName: 'presentacion', width: 140 },
        { field: 'venta', headerName: 'venta', width: 140 },
        { field: 'venta_aprobada', headerName: 'aprobados', width: 140 },
        { field: 'ganado', headerName: 'ganado', width: 140 },
        { field: 'recaudado', headerName: 'recaudado', width: 140 },

    

    ];

    const sortModel = [
        {
            field: 'id',
            sort: 'asc',
        },
    ];

    return { rows, columns, sortModel }

}



const GridAgrupado = ({ title, data, loading }) => {

    const { rows, columns, sortModel } = parseData(data);

    

    const classes = useStyles();

    return (

        <Paper className={classes.root}>
            <Box p={2}>
                <Typography variant="h4">{title}</Typography>
            </Box>

            <div style={{ height: 400, width: '100%' }}>
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>

                        <DataGrid

                            disableSelectionOnClick
                            selectable={false}
                            rowHeight={33}
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            sortModel={sortModel}
                            localeText={DEFAULT_LOCALE_TEXT}
                            checkboxSelection
                            loading={loading}

                            components={{
                                Toolbar: CustomToolbar,
                            }}
                        />
                    </div>
                </div>

            </div>
        </Paper>
    )
}

export default GridAgrupado;



const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.background.default,
        marginBottom: theme.spacing(3)
    }
}));







