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


import Oportunidades from './oportunidades';

import { useDispatch } from 'src/store';
import { useSnackbar } from 'notistack';
import { postOportunidadTieneEstado } from 'src/slices/oportunidad';
import useAuth from 'src/contextapi/hooks/useAuth';

const ProspectoView = () => {

    const { user } = useAuth();
    const classes = useStyles();
    const history = useHistory();
    const params = useParams();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [edit, setEdit] = useState(false);

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
                            Oportunidades
                        </Typography>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                            <Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
                                Ventas
                            </Link>
                            <Link variant="body1" color="inherit" to="/afp/prospecto" component={RouterLink}>
                                Oportunidades
                            </Link>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button
                                component={RouterLink}
                                to={`/afp/crm/oportunidad/mantenimientoOportunidad/${edit}`}
                                disabled={!edit}
                                color="secondary" variant="contained"
                                startIcon={<SvgIcon fontSize="small"> <EditIcon /> </SvgIcon>} >
                                ver
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    component={RouterLink}
                                    to="/afp/crm/oportunidad/opciones"
                                    color="secondary" variant="contained"
                                    startIcon={<SvgIcon fontSize="small"> <CreateIcon /> </SvgIcon>} >
                                    Nuevo
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Oportunidades setEdit={setEdit} />

            </Container>

        </Page>
    )
}

export default ProspectoView;



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
        boxShadow: "none"

    }
}));

