import React, { useState } from 'react'
import dayjs from 'dayjs';
import { DEFAULT_LOCALE_TEXT } from 'src/utils/localeText';
import JSONTree from 'react-json-tree';
import { DataGrid } from '@material-ui/data-grid';
import { Grid, IconButton, Typography, makeStyles, Box } from '@material-ui/core';
import { useHistory } from 'react-router';
import { Airplay, Download, DownloadCloud, Edit, Edit2, Eye, FileText, PenTool, Share2, Trash2 } from 'react-feather';
import { Link, BrowserRouter } from 'react-router-dom';
import Label from 'src/components/Label';
import LabelHex from 'src/components/LabelHex';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import Share from '@material-ui/icons/Share';
import { blobToFile, blobToUrl, urlDownload, typeToColor } from 'src/utils/filehelpers';

//:: MODAL IMPORTS
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import useAuth from 'src/contextapi/hooks/useAuth';
//:: END MODAL IMPORTS


const useStyles = makeStyles((theme) => ({
    btnContainer: {
        margin: theme.spacing(1),
        padding: '.3em'
    },
    dialogRoot: {
        flexGrow: 1,
    }
}));

const mapRows = (data) => {
    const payload = data.map(item => {

        const created_by = item.created_by.name.split(" ");
        const updated_by = item.updated_by.name.split(" ");
        const catDistribucion = item.catDistribucion.title;
        let tipoFondo = '';
        
        if(item.tipo_fondo) {
            tipoFondo = item.tipo_fondo.contenido;
        }

        return ({
            id: item.id,
            tipoFondo: tipoFondo,
            description: item.description,
            created_at: dayjs(item.created_at).format('YYYY/MM/DD'),
            updated_at: dayjs(item.updated_atupdated_at).format('YYYY/MM/DD'),
            created_by: created_by[2] + " " + created_by[0],
            updated_by: updated_by[2] + " " + updated_by[0],
            fileView: {
                id: item.id,
                file: item.share_point_file.blob_file,
                type: item.share_point_file.type,
            },
            fileShare: item.share_point_file.type,
            type: item.share_point_file.type,
            catDistribucion: catDistribucion


        })

    });
    return payload;
}


// const handleShare = async (file, description) => {
//     const fileURL = blobToUrl(file);
//     urlDownload(fileURL, description);
// }


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const SharepointFileGrid = ({ data, loading, handleDelete, canEdit }) => {
    const classes = useStyles();
   
  

    const gridConfig = {
        rows: mapRows(data),
        columns: [
            {
                field: 'type',
                headerName: 'TIPO',
                width: 120,
                renderCell: (params) => {
                    return (
                        <LabelHex color={typeToColor(params.value)}>
                            {params.value}
                        </LabelHex>
                    )
                }
            },
            { field: 'catDistribucion', headerName: 'CATEGORÍA', width: 210 },

            { field: 'tipoFondo', headerName: 'LÍNEA', width: 150 },

            {
                field: 'description',
                headerName: 'NOMBRE',
                width: 250,
                renderCell: (params) => {
                    return (
                        <p style={{ maxWidth: '300px', wordBreak: "break-word" }}>
                            {params.value}
                        </p>
                    )
                }
            },

            // {
            //     field: 'fileShare',
            //     headerName: 'DESCARGAR',
            //     width: 115,
            //     renderCell: (params) => {
            //         const { fileView, description } = params.row;
            //         const { file } = fileView;
            //         
            //         return (
            //             <IconButton onClick={() => handleShare(file, description)} >
            //                 <DownloadCloud />
            //             </IconButton>
            //         );
            //     }
            // },

            // {
            //     field: 'fileView',
            //     headerName: 'TRANSMITIR',
            //     width: 118,
            //     renderCell: (params) => {
            //         const { file, type, id } = params.value;
            //         return (
            //             <IconButton
            //                 disabled={!['pdf'].includes(type)}
            //                 onClick={() => handleSelect(id)}  >
            //                 <Airplay />
            //             </IconButton>
            //         )
            //     }
            // },

            { field: 'created_at', headerName: 'registrado', width: 130 },
            { field: 'updated_at', headerName: 'editado', width: 130 },



        ],
        sortModel: [{
            field: 'updated_at',
            sort: 'desc',
            type: 'date'
        }]

    }


    const [dialog, setDialog] = React.useState(false);
    const [action, setAction] = React.useState(false);
    const [selection, setSelection] = React.useState(false);



    const handleSelection = (itemId) => {
        setDialog(true);
        setSelection(itemId)
    }

   


    const handleShare = async (selection) => {
        
        //DESTRUCT
        const payload = data.find(item => item.id == selection);
        const { description, share_point_file } = payload;
        const { blob_file } = share_point_file;

        const {type} = share_point_file;
        
        //:: DOWNLOAD
        const fileURL = blobToUrl(blob_file);
        urlDownload(fileURL, description+type);
    }



    const handleReset = () => {
        setDialog(false);
        setAction(false)
        setSelection(false)
    };







    return (
        <>

            <div style={{ height: 700 }}>
                <DataGrid
                    loading={loading}
                    rows={gridConfig.rows}
                    columns={gridConfig.columns}
                    sortModel={gridConfig.sortModel}
                    pageSize={10}
                    localeText={DEFAULT_LOCALE_TEXT}
                    onSelectionChange={(newSelection) => {
                        handleSelection(newSelection.rowIds[0]);
                    }}
                    onRowSelected={
                        ({data}) => {
                            handleSelection(data.id);
                        }
                    }
                />
            </div>



            {/* MODAL */}

            <Dialog
                open={dialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleReset}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >


                {

                    !action ?

                        <>

                            <DialogTitle id="alert-dialog-slide-title">{"¿Qué desea realizar?"}</DialogTitle>

                            <DialogContent style={{ marginBottom: '1.2em' }}>

                                <Grid container >
                                    {/* <Grid item xs={12}
                                        className={classes.btnContainer}
                                    >

                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            startIcon={<Edit />}
                                            onClick={() => setAction('MODIFICAR')}
                                            size="large"

                                        >
                                            MODIFICAR
                                         </Button>
                                    </Grid> */}
                                    <Grid item xs={12}
                                        className={classes.btnContainer}
                                    >
                                        <Button
                                            disabled={!canEdit}
                                            variant="outlined"
                                            fullWidth
                                            startIcon={<Trash2 />}
                                            onClick={() => setAction('ELIMINAR')}
                                            size="large"

                                        >
                                            eliminar
                                        </Button>
                                    </Grid>

                                    <Grid item xs={12}
                                        className={classes.btnContainer}
                                    >
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            startIcon={<Download />}
                                            onClick={() => handleShare(selection)}
                                            size="large"

                                        >
                                            Descargar
                                        </Button>
                                    </Grid>

                                </Grid>





                            </DialogContent>


                        </>




                        : (action && action === "ELIMINAR") ?

                            <>
                                <DialogContent>
                                    <Box p={3}>
                                        <Typography variant='h5'>
                                            ¿Está seguro de querer eliminar el archivo ?
                                        </Typography>
                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleReset} color="primary">
                                        NO
                                    </Button>
                                    <Button onClick={() => handleDelete(selection)} color="primary">
                                        SI
                                    </Button>

                                </DialogActions>
                            </>


                            : (action && action === "MODIFICAR") &&

                            <>
                                <DialogContent>
                                    {/* <Box p={3}>
                                        <Typography variant='h5'>
                                            ¿Está seguro de querer eliminar el registro ?
                                        </Typography>
                                    </Box> */}
                                </DialogContent>
                                <DialogActions>
                                    {/* <Button onClick={handleDelete} color="primary">
                                        SI
                                    </Button> */}
                                </DialogActions>
                            </>




                }










            </Dialog>
        </>
    )
}

export default SharepointFileGrid
