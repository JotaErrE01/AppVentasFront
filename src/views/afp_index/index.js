import React, { Fragment } from 'react'
import { Container, Typography, makeStyles, Box, Breadcrumbs, Link } from '@material-ui/core';
import Page from 'src/components/Page';
import { Link as RouterLink } from 'react-router-dom';
import Mainmenu from './Mainmenu';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
// 
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: 100
    }
}));

const OportunidadCreateView = () => {
    const classes = useStyles();
    return (
        <Page className={classes.root} title="Crear oportunidad" >
            <Container maxWidth="xl">
                <Mainmenu />
            </Container>
        </Page>

    );
};

export default OportunidadCreateView;
