import React, { useState, useEffect } from 'react';
import {
    AppBar,
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
    Link,
    Tab,
    Tabs,
    Typography
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Page from 'src/components/Page';
import { makeStyles } from '@material-ui/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { getEfectividad, getFirmaPersona, getFirmaSistemas, getFirmaTotales, getProspectos } from 'src/slices/analytics';
import { useDispatch, useSelector } from 'react-redux';
import Form from './Form';
import dayjs from 'dayjs';
import { getOportunidadEstados } from 'src/slices/oportunidad';
import { useSnackbar } from 'notistack';
import { getSalasCore } from 'src/slices/coreSala';
import useAuth from 'src/contextapi/hooks/useAuth';
import JSONTree from 'react-json-tree';
import GridTable from './GridTable';
import Chart from './Chart'
const FirmaSistemasView = () => {

    const { user: userSession } = useAuth();
    const dispatch = useDispatch();
    const classes = useStyles();


    const [feIni, setFeIni] = useState();
    const [feFin, setfeFin] = useState();
    const [value, setValue] = useState(0);



    useEffect(
        () => {
            const fe_fin = dayjs();
            const fe_inicio = dayjs().subtract(6, 'month');
            setFeIni(fe_inicio.toDate());
            setfeFin(fe_fin.toDate());
            dispatch(getFirmaSistemas(fe_inicio.format('YYYY-MM-DD'), fe_fin.format('YYYY-MM-DD')));
        },
        []
    );


    const {
        firmaSistemasFetch,
        firmaSistemasError,
        firmaSistemasPayload,
    } = useSelector((state) => state.analytics);
    return (
        <Page className={classes.root} title="Analiticas | Firmas">
            <Container maxWidth="xl">

                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
                        Analítica
                    </Link>
                    <Link variant="body1" color="inherit" to="/afp/analytics" component={RouterLink}>
                        Reportes
                    </Link>
                    <Typography variant="body1" color="textPrimary">
                        Firmas
                    </Typography>
                </Breadcrumbs>


                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6}>
                            <Chart data={firmaSistemasPayload}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <GridTable
                            data={firmaSistemasPayload}
                        />
                    </Grid>
                </Grid>


                <Box mt={3}>
                    <Card>

                    </Card>
                </Box>


            </Container>
        </Page>
    )
}

export default FirmaSistemasView;



const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));