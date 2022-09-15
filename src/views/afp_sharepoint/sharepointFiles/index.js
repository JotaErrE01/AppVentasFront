import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';
import { deleteSharePointFile, getSharepointFile } from 'src/slices/sharepointFile';
import { Grid, Paper, Container, Typography, Link, Breadcrumbs, makeStyles } from '@material-ui/core';
import { NavigateNext as NavigateNextIcon } from '@material-ui/icons';

import SharepointFileGrid from './SharepointFileGrid';
import SharepointEditForm from './SharepointEditForm';
import useAuth from 'src/contextapi/hooks/useAuth';

import { Link as RouterLink } from 'react-router-dom';


const SharePointFiles = ({ setEdit }) => {


    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const classes = useStyles();

    //HOOKS
    const [tipoFondo, setTipoFondo] = useState();
    const [catDistribucion_id, set_catDistribucion_id] = useState();

    // DATA
    const _sharepointFile = useSelector(state => state.sharepointFile);
    const { sharepointFiles, tipoFondos, catDistribucion, loading, error } = _sharepointFile;

    // FETCH
    useEffect(() => {
        if (!sharepointFiles.length) {
            dispatch(getSharepointFile(enqueueSnackbar));
            setTipoFondo(tipoFondos && tipoFondos.length && tipoFondos[0]);
            set_catDistribucion_id(catDistribucion && catDistribucion.length && catDistribucion[0]);

        }
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteSharePointFile(id, enqueueSnackbar));
    }

    const { user } = useAuth();
    const { tipo_venta_asesor } = user;
    const canEdit = tipo_venta_asesor == 1 ? false : tipo_venta_asesor == 2 ? false : true;


    return (
        <>

            <Grid container spacing={3} justify="space-between">
                <Grid item>
                    <Typography variant="h3" color="textPrimary">
                        Administrador de archivos
                    </Typography>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                        <Link variant="body1" color="inherit" to="/afp/sharepoint" component={RouterLink}>
                            Archivos
                        </Link>
                    </Breadcrumbs>
                </Grid>
                <Grid item>
                    {
                        canEdit &&
                        <SharepointEditForm
                            tipoFondo={tipoFondo}
                            setTipoFondo={setTipoFondo}
                            tipoFondos={tipoFondos}
                            catDistribucion_id={catDistribucion_id}
                            set_catDistribucion_id={set_catDistribucion_id}
                            catDistribucion={catDistribucion}
                        />
                    }
                </Grid>
            </Grid>                <Paper className={classes.paper}>
                {
                    error ? <p>error</p>
                        : <SharepointFileGrid
                            data={sharepointFiles}
                            oading={loading}
                            handleDelete={handleDelete}
                            canEdit={canEdit}
                        />
                };
            </Paper>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    }
}));


export default SharePointFiles;
