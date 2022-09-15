
import React, { useState } from 'react'
import { DataGrid, get } from '@material-ui/data-grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { DEFAULT_LOCALE_TEXT } from 'src/utils/localeText';
import dayjs from 'dayjs';
import { AppBar, IconButton, Tab, TableCell, Tabs } from '@material-ui/core';
import Label from 'src/components/Label';
import { usdPrice } from 'src/utils/dataGrids';
import useAuth from 'src/contextapi/hooks/useAuth';
import WarnIcon from '@material-ui/icons/WarningRounded';
import DoneIcon from '@material-ui/icons/Done';
import { green, amber } from '@material-ui/core/colors';






const calcGrid = (data, sortModel, statusArr, isAprobador) => {
    const payload = [];
    for (const property in statusArr) {
        payload.push({
            title: property,
            data: gridConfig(data, property, sortModel, statusArr, isAprobador),
        });
    };
    return payload;
}



const mapRows = (data, status, sortModel, statusArr) => {

    const group = statusArr[status];


    const _payload = data.filter(function (row) {
        return group.includes(row.oportunidad_tiene_estado.oportunidad_estado.id);
    });


    const payload = _payload.map(item => {

        const cliente = item.cliente ? item.cliente : null;
        const estado = item.oportunidad_tiene_estado ? item.oportunidad_tiene_estado.oportunidad_estado : ''
        const fondo =
            item.fondo ? item.fondo.contenido : '';

        const aporte =
            item.aporte ?
                item.aporte.monto_aporte : ''
        const updated_at = dayjs(item.updated_at).format('YYYY/MM/DD')
        const created_at = dayjs(item.created_at).format('YYYY/MM/DD')
        return (
            {
                id: item.id,
                updated_at: updated_at,
                estado: estado.contenido,
                color: estado.codigo,
                orden_estricto: estado.orden_estricto,

                cliente: cliente ? `${cliente.primer_nombre} ${cliente.primer_apellido} ` : '',
                codigo_cliente: cliente ? cliente.codigo_cliente : '',
                oportunidad: fondo,
                aporte: aporte,
                created_at: created_at,
                regularizarEmpresa: item.regularizarEmpresa
            }
        )
    });

    return payload;
}


const gridConfig = (data, status, sortModel, statusArr, isAprobador) => {

 
        const warining = isAprobador ? {
            field: 'regularizarEmpresa',
            headerName: 'Empresa',
            width: 110,
            align: 'center',
            renderCell: (params) => {
                const regularizar = params.value;

                if (regularizar) {
                    return (
                        <IconButton onClick={() => { }} >
                            <WarnIcon style={{ color: amber[200] }} />
                        </IconButton>
                    );
                }

                return (<IconButton onClick={() => { }} >
                    <DoneIcon style={{ color: green[400] }} />
                </IconButton>);
            }
        }:{}

    return {

        rows: mapRows(data, status, sortModel, statusArr),
        columns: [
            { field: 'id', headerName: 'id', type: 'dateTime', width: 74, hide: false },
            { field: 'orden_estricto', headerName: 'orden_estricto', width: 200, hide: true },
            { field: 'created_at', headerName: 'Creado', type: 'dateTime', width: 150 },
            { field: 'updated_at', headerName: 'Editado', type: 'dateTime', width: 150 },
            {
                field: 'estado',
                headerName: 'estado',
                width: 200,
                renderCell: (params) => {
                    return (
                        <Label color={params.row.color}>
                            {params.value}
                        </Label>
                    )
                }
            },
            { field: 'cliente', headerName: 'Cliente', width: 200 },
            { field: 'codigo_cliente', headerName: 'Identificación', width: 200 },
            { field: 'oportunidad', headerName: 'Oportunidad', width: 200 },
            { field: 'aporte', headerName: 'Aporte', ...usdPrice },
            warining
        ],
        sortModel: sortModel
    }
};






function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                props.children
            )}
        </div>
    );
};


const OportunidadesGrid = ({ data, rows, loading, onPageChange, setEdit, sort , isAprobador}) => {

    const { user } = useAuth();

    const { sortModel, setSortModel } = sort;

    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

   
    



    const statusArr = !isAprobador ?

        {
            "registrado": [8],
            "validación": [12, 13],
            "firma": [1, 2, 3],            
            // "pre operación": [15, 16, 17],
            "operación": [4, 5, 6],
            "alta": [7, 11],
        }
        :
        
        {
            "Por revisar": [4, 5],
            "alta": [7, 11],
        };


    const handleSortModelChange = (params) => {
        if (params.sortModel.length) {

            if (params.sortModel[0].field == 'estado') {

                const _sort = params.sortModel[0].sort == 'desc' ? 'asc' : 'desc';

                const _sortModel = [{ field: "orden_estricto", sort: _sort }];
                setSortModel(_sortModel);
                return;
            }
            else {

                //:: NATIVO, COMO ESTÁ EN LA DOCUMENTACIÓN
                if (params.sortModel !== sortModel) {

                    setSortModel(params.sortModel);
                }
            }
        };
    };


    const grids = calcGrid(data, sortModel, statusArr, isAprobador);




    const changeTab = (event, newValue) => {
        setValue(newValue);
    };

    const changeIndex = (index) => {
        setValue(index);
    };

    // function a11yProps(index) {
    //     return {
    //         id: `full-width-tab-${index}`,
    //         'aria-controls': `full-width-tabpanel-${index}`,
    //     };
    // }

    function a11yProps(index) {
        return {
          id: `wrapped-tab-${index}`,
          'aria-controls': `wrapped-tabpanel-${index}`,
        };
    }

    return (

        <div className={classes.root}>
            <AppBar 
            
            position="static" 
            
            color="default">
                <Tabs
                    value={value}
                    onChange={changeTab}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
          
                >
                    {
                        grids.map((item, index) => {

                            return (
                                <Tab label={item.title} {...a11yProps(0)} />
                            )
                        })
                    }

                </Tabs>


            </AppBar>

            {/* <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={changeIndex}
            > */}
            {
                grids.map(({ data }, index) => {
                    return (<TabPanel value={value} index={index} dir={theme.direction}>
                        <div style={{ height: 700 }}>
                            <DataGrid
                                localeText={DEFAULT_LOCALE_TEXT}
                                rows={data.rows}
                                columns={data.columns}
                                sortModel={data.sortModel}
                                pagination
                                pageSize={10}
                                // rowCount={rows}
                                loading={loading}
                                onSelectionChange={(newSelection) => {


                                    setEdit(newSelection.rowIds[0]);
                                }}
                                onRowSelected={
                                    ({ data }) => {
                                        setEdit(data.id);
                                    }
                                }
                                onSortModelChange={handleSortModelChange}
                            // onPageChange={onPageChange}
                            //paginationMode="server"
                            //sortingMode="server"
                            />
                        </div>
                    </TabPanel>)
                }
                )
            }
            {/* </SwipeableViews> */}
        </div>
    );
}

export default OportunidadesGrid;


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));
