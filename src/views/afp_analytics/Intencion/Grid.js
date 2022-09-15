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
function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}



function parseData(data) {
    const rows = data.map((item) => {
        return {
            id: item.intecion_id,
            int_created: item.int_created,

            int_fase: item.int_fase || '',
            int_fase_orden: item.int_fase_orden || '',
     
            prospecto_id: item.prospecto_id,
            prospecto_nombre: item.prospecto_nombre,
            int_user_id: item.int_user_id,
            int_user_name: item.int_user_name,
            phone_count: item.phone_count || '',
            video_count: item.video_count || '',
        };
    });

    const columns = [
        { field: 'id', headerName: 'id', width: 90 },
        { field: 'int_created', headerName: 'creado', width: 150 },
        { field: 'int_fase', headerName: 'fase', width: 120 },
        { field: 'int_fase_orden', headerName: 'int_fase_orden', width: 120, hide: true },

        { field: 'prospecto_id', headerName: 'prospecto_id', width: 120, hide: true },
        { field: 'prospecto_nombre', headerName: 'prospecto_nombre', width: 250 },
        { field: 'int_user_name', headerName: 'asesor', width: 250 },
        { field: 'phone_count', headerName: 'llamadas', width: 120 },
        { field: 'video_count', headerName: 'videos', width: 120 },
    

    ];

    const sortModel = [
        {
            field: 'int_fase_orden',
            sort: 'asc',
        },
    ];

    return { rows, columns, sortModel }

}



const Grid = ({ title, data, loading }) => {

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

export default Grid;



const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.background.default,
        marginBottom: theme.spacing(3)
    }
}));







