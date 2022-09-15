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


import { useHistory, useParams } from 'react-router';


import Page from 'src/components/Page';
import SharepointFiles from './sharepointFiles';


import { useDispatch } from 'src/store';
import { deleteProspecto } from 'src/slices/prospecto';
import { useSnackbar } from 'notistack';
import SharepointVideos from './sharepointFiles/SharepointVideos';


function SharepointView() {

    const classes = useStyles();
    const history = useHistory();
    const params = useParams();

    ///CREAR :: EDITAR
    const isCreate = history.location.pathname == "/afp/sharepoint/crear" && true;
    const [edit, setEdit] = useState(false);




    return (
        <Page className={classes.root} title="Archivos">
            <Container maxWidth="xl">
                <SharepointFiles />
            </Container>

            {/* <Container maxWidth="xl">
                <Grid container spacing={3} justify="space-between">
                    <Grid item>
                        <Typography variant="h3" color="textPrimary">
                            Videos Tutoriales
                        </Typography>
                    </Grid>
                </Grid>
                <Grid>
                    <SharepointVideos />
                </Grid>
            </Container>  */}

        </Page>
    );
}


export default SharepointView;



const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    }
}));