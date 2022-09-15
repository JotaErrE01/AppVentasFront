import React, { useEffect, useState } from 'react';
import {
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    Divider,
    Grid,
    IconButton,
    Link,
    Typography
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Page from 'src/components/Page';
import { makeStyles } from '@material-ui/styles';
import { Alert } from '@material-ui/lab';
import { getRegistroCivil } from 'src/slices/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import useAuth from 'src/contextapi/hooks/useAuth';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { es } from 'date-fns/locale';

import Form from './Form';
import { format, subDays } from 'date-fns';
import DataTable from './DataTable';
import DataExport from './DataExport';

const RegistroCivil = () => {
    const { user: userSession } = useAuth();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const [feIni, setFeIni] = useState(null);
    const [feFin, setFeFin] = useState(null);

    const analyticsState = useSelector(state => state.analytics)

    const handleConsultar = (payload) => {

        dispatch(getRegistroCivil({
            fe_ini: format(payload.fe_ini, "yyyy/MM/dd"),
            fe_fin: format(payload.fe_fin, "yyyy/MM/dd")
        }));

        //set form;
        setFeIni(payload.fe_ini);
        setFeFin(payload.fe_fin);
    }

    useEffect(
        () => {
            const payload = {
                fe_ini: subDays(new Date(), 15),
                fe_fin: new Date()
            }
            dispatch(getRegistroCivil({ ...payload }));
            //set form;
            setFeIni(payload.fe_ini);
            setFeFin(payload.fe_fin);
        }, []
    );


    return (
        <Page className={classes.root} title="Oportunidades">
            <Container maxWidth="xl">
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
                        Analítica
                    </Link>
                    <Link variant="body1" color="inherit" to="/afp/analytics" component={RouterLink}>
                        Reportes
                    </Link>
                    <Typography variant="body1" color="textPrimary">
                        Uso del Registro Civil
                    </Typography>
                </Breadcrumbs>

                <Card>
                    <CardHeader
                        title={"Uso de api del Registro Civil"}
                        subheader={feIni && feFin && ` ${format(new Date(feIni), 'cccc dd MMM yyyy', { locale: es })} - ${format(new Date(feFin), 'cccc dd MMM yyyy', { locale: es })}`}
                        action={
                            <Form fe_inicio={feIni} fe_fin={feFin}
                                onChangeDates={handleConsultar}

                            />
                        }
                    />
               
                    <CardContent>


                    <Box mb={3}>
                        <DataExport
                            data={analyticsState.registroCivilPayload}
                            fileName={"uso-registro-civil"}
                        />
                    </Box>


                        <DataTable
                            data={analyticsState.registroCivilPayload}
                            loading={analyticsState.registroCivilFetch}
                            dateFormat={"yyyy/MMM/dd"}
                        />
                    </CardContent>
                </Card>


            </Container>
        </Page>
    )
};

const useStyles = makeStyles((theme) => (
    {

        root: {
            // backgroundColor: theme.palette.background.dark,
            minHeight: '100%',
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3)
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff'
        },
        paper: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3)
        },
        menu: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3)
        }
    }));

export default RegistroCivil;
