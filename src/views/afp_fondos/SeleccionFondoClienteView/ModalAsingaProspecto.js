import { Card, makeStyles, Typography, Link, Grid, Button, Divider, List, ListItem, ListItemText, Box } from '@material-ui/core'
import React, { useEffect } from 'react'
import JSONTree from 'react-json-tree';
import { getProspectos, loadProspecto } from 'src/slices/prospecto';
import { useDispatch, useSelector } from 'src/store';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router';

const ModalAsingaProspecto = ({onNextStep}) => {
    const classes = useStyles();
    const history = useHistory();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProspectos(() => { }));
    }, []);

    const prospectoState = useSelector((state) => state.prospecto);
    const { prospectos } = prospectoState || [];

    const goBack = () => history.goBack();

    const handleLoadProspecto = (prospecto) => {
        dispatch(loadProspecto(prospecto, onNextStep));
    }


    return (
        <Card style={{ marginTop: 100 }} className={classes.paper}>
            <Grid item xs container direction="row" justify="space-between">
                <Typography color="textSecondary" gutterBottom>
                    Seleccione un prospecto
                </Typography>
                <Link component={Button} onClick={goBack ? goBack : () => { }}>
                    <CloseIcon style={{ color: 'black' }} />
                </Link>
            </Grid>
            <Divider light={true} />

            <Box mb={6}>
                <Grid item>
                    <List component="nav" className={classes.list} aria-label="mailbox folders">
                        {prospectos.map((item, index) => (
                            <ListItem

                                onClick={() => handleLoadProspecto(item)}

                                key={index}
                                button>
                                <ListItemText primary={item.nombre_cliente} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Box>

        </Card>

    )
}

export default ModalAsingaProspecto;


const useStyles = makeStyles((theme) => ({
    title: {
        fontFamily: 'Roboto',
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: '20px',
        letterSpacing: '-0.05000000074505806px',
        textAlign: 'left'
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 637
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper
    },
    flex: {
        flexGrow: 1
    }
}));