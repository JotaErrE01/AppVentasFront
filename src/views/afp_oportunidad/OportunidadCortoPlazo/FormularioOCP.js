import React, { useState, useEffect, Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Breadcrumbs,
    Container,
    Grid,
    Link,
    Typography,
    makeStyles,
    Card,
    CardContent,
    Avatar,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Page from 'src/components/Page';
import { useSelector } from 'src/store';

import FormOCPStepOne from './stepOne/Index';
import FormOCPStepTwo from './stepTwo/Index';
/* import CodigoFondoCortoPlazoFI from '../../../views/JSON_CATALOGOS/CODIGO_FONDO_CORTO_PLAZO_FI'; */

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#F2F2F2',
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    separate: {
        marginTop: '1.5em'
    },
    separateButton: {
        marginTop: '2em',
        paddingLeft: '1.5em',
        paddingRight: '1.5em',
    },
    estilotipoFondo: {
        marginTop: '1.3em',
        paddingLeft: '1.5em',
        paddingRight: '1.5em',
    },
    montoFondo: {
        marginTop: '1.5em',
        fontSize: '2em',
    },
    avatarBanner: {
        marginTop: '.5em',
        marginLeft: '.8em',
        width: '6.25em',
        height: '6.25em',
        color: '#fff',
        backgroundColor: '#FAFAFA',
    },
}));

const FormularioOCP = () => {
    const classes = useStyles();
    const { ConsultarData } = useSelector((state) => state.cliente);
    const CedStep = ConsultarData.numero_identificacion;
    const [currentPage, setCurrentPage] = useState(ConsultarData && ConsultarData.step ? ConsultarData.step : 1);
    const [actionType, setActionType] = useState(1);
    const tipoFondo = useSelector((state) => state.cliente.tipoFondo);
    const [tipoFondoBanner, settipoFondoBanner] = useState('');

    useEffect(() => {
        if(ConsultarData.id && ConsultarData.id > 0 && (typeof ConsultarData.step == 'undefined' || ConsultarData.step == '')){
            setActionType(0)
        }

        if (tipoFondo.codigo === '000029') {
            settipoFondoBanner('FONDO DE INVERSIONES A CORTO PLAZO MASTER');
        } else if (tipoFondo.codigo === '000033') {
            settipoFondoBanner('FONDO DE INVERSIONES A CORTO PLAZO ESTRATEGICO');
        } else if (tipoFondo.codigo === '000038') {
            settipoFondoBanner('FONDO DE INVERSIONES A CORTO PLAZO RENTAPLUS');
        } else if (tipoFondo.codigo === '000040') {
            settipoFondoBanner('FONDO DE INVERSIONES A CORTO PLAZO SUPERIOR');
        }
    }, []);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
        if (currentPage == 4) {
            setCurrentPage(1);
        }
    };

    const previusPage = () => {
        setCurrentPage(currentPage - 1)
    };

    const crateOrEdit = () => {
        switch (actionType) {
            case 0:
                return (
                    <Fragment>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" >
                            <Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink} > Ventas </Link>
                            <Link variant="body1" color="inherit" to="/afp/crm/oportunidad/seleccionarFondo" component={RouterLink} > Crear Oportunidad </Link>
                            <Typography variant="body1" color="textPrimary" > Fondo a Corto Plazo </Typography>
                        </Breadcrumbs>
                        <Typography variant="h3" color="textPrimary" > Nueva Oportunidad</Typography>
                    </Fragment>
                );
            case 1:
                return (
                    <Fragment>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" >
                            <Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink} > Ventas </Link>
                            <Link variant="body1" color="inherit" to="/afp/crm/oportunidad/seleccionarFondo" component={RouterLink} > Crear Oportunidad </Link>
                            <Typography variant="body1" color="textPrimary" > Fondo a Corto Plazo </Typography>
                        </Breadcrumbs>
                        <Typography variant="h3" color="textPrimary" > Editar Oportunidad</Typography>
                    </Fragment>
                );
            default:
                return null;
        }
    };

    const bannerTipoFondo = () => {
        return (
            <Fragment>
                <Box mt={3}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2} >
                                <Grid item md={2} xs={12} >
                                    <Avatar variant="rounded" src="/static/images/fondos/cajaFuerte.png" className={classes.avatarBanner} />
                                </Grid>
                                <Grid item md={7} xs={12} >
                                    <Typography className={classes.estilotipoFondo} variant="h3" color="textPrimary" > { tipoFondoBanner } </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} >
                                    <Typography className={classes.montoFondo} variant="h3" color="textPrimary" > $9,000.00 </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Fragment>
        );
    };

    const renderStep = () => {
        switch (currentPage) {
            case 1:
                return (
                    <FormOCPStepOne
                        actionType={actionType}
                        nextPage={nextPage}
                    />
                );
            case 2:
                return (
                    <FormOCPStepTwo
                        actionType={actionType}
                        nextPage={nextPage}
                        previusPage={previusPage}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Page className={classes.root} title="Fondo a Corto Plazo" >
            <Container maxWidth="lg">
                {crateOrEdit(actionType)}
                <Box>
                    <Grid container>
                        <Grid item md={12} xs={12} >
                            {bannerTipoFondo()}
                            {renderStep()}
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Page>
    );
};


export default FormularioOCP;
