import React, { useEffect, useState } from 'react';

import {
    Container,
    Breadcrumbs,
    Button,
    Grid,
    Link,
    SvgIcon,
    Typography,
    makeStyles,
    Paper

} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Edit as EditIcon, Plus as CreateIcon } from 'react-feather';

//custom
import Page from 'src/components/Page';
import ActividadEdit from 'src/views/afp_actividad/actividadEdit';
import ActividadOptions from 'src/views/afp_actividad/actividadOptions'
import Actividades from 'src/views/afp_actividad/actividades';


import Buttons from 'src/components/common/Buttons'
import { useDispatch } from 'src/store';
//import { deleteActividad } from 'src/slices/actividad';
import { useSnackbar } from 'notistack';
import ActividadSpeedDial from 'src/views/afp_actividad/actividadEdit/ActividadSpeedDial';

const ActividadView = () => {
    const classes = useStyles();

    const history = useHistory();
    const params = useParams();

    ///CREAR :: EDITAR



    const [edit, setEdit] = useState(false);
    const [options, setOptions] = useState(true);
    ///

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();


    const isCreate = history.location.pathname == "/afp/actividad/crear";
    const isCreateSpeedDial = history.location.pathname == "/afp/actividad/crear/speeddial";
    const isEdit = params.id && true;

    const isList = true


    function onDelete(edit) {
        
    }


    return (
        <Page
            className={classes.root}
            title="Ventas | Actividades" >

            <Container maxWidth="xl">
                <Grid container spacing={3} justify="space-between">
                    <Grid item>
                        <Typography variant="h3" color="textPrimary">
                            Agenda de actividades
                        </Typography>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                            <Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
                                Ventas
                            </Link>
                            <Link variant="body1" color="inherit" to="/afp/actividad" component={RouterLink}>
                                Agenda de actividades
                            </Link>
                        </Breadcrumbs>
                    </Grid>

                    <Grid item>
                        <Grid container spacing={2}>
                            {/* <Grid item>
                                <Buttons
                                    disabled={!edit}
                                    onClick={() => onDelete(edit)}
                                />
                            </Grid> */}
                            <Grid item>
                                <Button
                                    component={RouterLink}
                                    to={`/afp/actividad/editar/${edit}`}
                                    disabled={!edit}
                                    color="secondary" variant="contained"
                                    startIcon={<SvgIcon fontSize="small"> <EditIcon /> </SvgIcon>} >
                                    Editar
                                 </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    component={RouterLink}
                                    to="/afp/actividad/crear"
                                    onClick={() => setOptions(true)}
                                    disabled={isCreate} color="secondary" variant="contained"
                                    startIcon={<SvgIcon fontSize="small"> <CreateIcon /> </SvgIcon>} >
                                    Nuevo
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>

                <Paper className={classes.paper}>
                    {isCreate && <ActividadEdit create={isCreate} />}
                    {isEdit && <ActividadEdit id={params.id} />}
                    {!isCreateSpeedDial && isList && <Actividades setEdit={setEdit} />}
                </Paper>



                {

                    isCreateSpeedDial ? <ActividadSpeedDial />
                        : options && <ActividadOptions />
                }





            


            </Container>

        </Page>

    )
}

export default ActividadView;



const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    menu: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    }
}));

