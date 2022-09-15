import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Container,
    makeStyles,
    Avatar,
    Typography,
    Divider
} from '@material-ui/core';
import Page from 'src/components/Page';
import useAuth from 'src/contextapi/hooks/useAuth';
import JWTLogin from './JWTLogin';
import DebugDialog from 'src/components/common/DebugDialog';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },
    cardContainer: {
        paddingBottom: 80,
        paddingTop: 80,
    },
    cardContent: {
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        minHeight: 300
    },
    rounded: {
        color: '#fff',
        backgroundColor: '#4CAF50',
        marginLeft: theme.spacing(4),
    },
    textTitle: {
        marginLeft: theme.spacing(4),
        marginTop: theme.spacing(4),
        fontSize: '2em'
    }
}));

const LoginModule = () => {
  const classes = useStyles();
  const { method, errors } = useAuth();


  return (
    <Page className={classes.root} title="Login">
        <Container className={classes.cardContainer} maxWidth="sm">

            <Card>

                <Typography variant="h3" className={classes.textTitle}>Iniciar Sesión</Typography>
                <CardContent className={classes.cardContent}>
                    <Divider variant="middle" />
                    {method === 'JWT' && <JWTLogin /> }
                </CardContent>
            </Card>

            <DebugDialog data={errors}/>
        </Container>
    </Page>
  );
};

export default LoginModule;
