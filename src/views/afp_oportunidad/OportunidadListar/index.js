import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Breadcrumbs,
    Container,
    Grid,
    Link,
    Typography,
    makeStyles,

    Divider,
    Tabs,
    Tab,
} from '@material-ui/core';
import Page from 'src/components/Page';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import axios from 'src/utils/axios_old';
import useIsMountedRef from 'src/contextapi/hooks/useIsMountedRef';
import OportunidadesPendientes from './OportunidadesPendientes';
import OportunidadesTerminadas from './OportunidadesTerminadas';

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
        marginTop: '1.5em',
        paddingLeft: '1.5em',
        paddingRight: '1.5em',
    }
}));

const ListadoOportunidades = () => {
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const [currentTab, setCurrentTab] = useState('Pendientes');
    const [project, setProject] = useState(null);

    const tabs = [
        { value: 'Pendientes', label: 'Pendientes' },
        { value: 'Aprobados', label: 'Aprobados' },
    ];

    const handleTabsChange = (event, value) => {
        setCurrentTab(value);
    };


    return (
        <Page className={classes.root} title="Lista de Oportunidades" >
            <Container>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" >
                    <Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink} > Ventas </Link>
                    <Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink} > Ver o Crear Oportunidad </Link>
                    <Typography variant="body1" color="textPrimary" > Lista de Oportunidades/Fondos  </Typography>
                </Breadcrumbs>
                <Box>
                    <Grid container>
                        <Grid item md={12} xs={12} >
                            <Box mt={3} mb={1}>
                                <Tabs onChange={handleTabsChange} scrollButtons="auto" textColor="secondary" value={currentTab} variant="scrollable" >
                                    {tabs.map((tab) => (
                                        <Tab key={tab.value} label={tab.label} value={tab.value} />
                                    ))}
                                </Tabs>
                            <Divider />
                            </Box>
                            {currentTab === 'Pendientes' && <OportunidadesPendientes />}
                            {currentTab === 'Aprobados' && <OportunidadesTerminadas />}
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Page>
    );
};


export default ListadoOportunidades;
