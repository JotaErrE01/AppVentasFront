import React from 'react'
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import FeaturesFondo from './MenuFondo'


    const useStyles = makeStyles((theme) => ({
        root: {
            background: 'rgba(0,0,0,.38)',
            minHeight: '100%',
            paddingTop: theme.spacing(3),
            paddingBottom: 100
        }
    }));

const MenuFondo = () => {
    const classes = useStyles();
    return (
        <Page className={classes.root} title="Cliente | Crear " >
            <Container maxWidth="lg">
              <FeaturesFondo />
            </Container>
        </Page>
    );
}


export default MenuFondo;
