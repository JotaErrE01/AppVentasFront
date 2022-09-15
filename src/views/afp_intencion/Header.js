import React from 'react'
import {
    Container, Grid, Typography, Breadcrumbs, Link,
    classes,
    makeStyles,
    Button
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import Page from 'src/components/Page';
import { Link as RouterLink } from 'react-router-dom';
import ToggleIntencion from './ToggleIntencion';



const Header = () => {
    const classes = useStyles();

    return (
        <Page className={classes.root} title="Embudo de ventas" >

            <Container maxWidth="xl">
                <Grid container spacing={3} justify="space-between">
                    <Grid item>
                    <ToggleIntencion />

                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                            <Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
                                Ventas
                            </Link>
                            <Link variant="body1" color="inherit" to="/afp/prospecto" component={RouterLink}>
                                Embudo
                            </Link>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item>

                    </Grid>
                </Grid>
            </Container>

        </Page>
    )
}

export default Header
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        // minHeight: '100%',
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
        background: theme.palette.primary.contrastText
    }
}));

