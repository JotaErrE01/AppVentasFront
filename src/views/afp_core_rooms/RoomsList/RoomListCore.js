import React, { useEffect } from 'react'
import { Avatar, List, ListSubheader, Box, ListItem, ListItemAvatar, ListItemText, Link, ListItemSecondaryAction, IconButton, Button, CardHeader, Typography, CircularProgress } from '@material-ui/core'
import PerfectScrollbar from 'react-perfect-scrollbar';
import { buildSalasCore, getSalasCore } from 'src/slices/coreSala';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'src/store';
import { Link as RouterLink } from 'react-router-dom';
import { Airplay, Edit, Edit2, Edit3 } from 'react-feather';
import { GroupWork, GroupWorkRounded, PeopleRounded, ViewStreamOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import useAuth from 'src/contextapi/hooks/useAuth';
import { Skeleton } from '@material-ui/lab';
import LoadBounce from 'src/components/common/LoadBounce';
import JSONTree from 'react-json-tree';


const RoomListCore = () => {


    const classes = useStyles();
    const { user } = useAuth();
    const dispatch = useDispatch();


    const coreSala = useSelector(state => state.coreSala)
    const coreSalaArr = (coreSala && coreSala.coreSalaArr && coreSala.coreSalaArr.length)
        ? coreSala.coreSalaArr
        : [];
    const { loadingArr, buildingSala } = coreSala;


    const fetchSalas = () => {
        dispatch(getSalasCore());
    }
    const handleBuildSala = () => {
        dispatch(buildSalasCore(fetchSalas));
    }

    useEffect(() => {
        fetchSalas();
    }, [dispatch]);



    return (
        <Box p={2}>



            <List>
                <ListSubheader disableGutters >SALAS DE VENTA</ListSubheader>

                <ListItem disableGutters >
                    <ListItemSecondaryAction>
                        {
                            buildingSala ?
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    onClick={handleBuildSala}
                                    endIcon={<CircularProgress size={15} />}
                                >
                                    Construyendo
                                </Button>
                                :
                                <Button variant="outlined" size="small" color="secondary"
                                    onClick={handleBuildSala}
                                >
                                    Actualizar
                                </Button>
                        }

                    </ListItemSecondaryAction>
                </ListItem>


            </List>




            <List disablePadding>
                {coreSalaArr.map(item => (
                    <ListItem to={`/coreSala/${item.id}`} key={item.id} component={RouterLink} disableGutters>
                        <Button
                            startIcon={<GroupWorkRounded />}
                            className={classes.button}>
                            <Box className={classes.buttonBody} >
                                <span> {item.descripcion_sala} </span>
                                <span className={classes.buttonSubtitle}>{item.description}</span>
                            </Box>
                        </Button>
                    </ListItem>
                ))}
                {
                    (loadingArr) ? (
                        <ListItem disableGutters>
                            <Button
                                startIcon={<Skeleton animation="wave" variant="circle" width={24} height={24} />}
                                className={classes.button}>
                                <Box className={classes.buttonBody} >
                                    <Skeleton animation="wave" height={10} width="100%" />
                                    <Skeleton animation="wave" height={10} width="100%" />
                                </Box>
                            </Button>
                        </ListItem>
                    )

                        : <></>
                }




            </List>
        </Box>
    )
}

export default RoomListCore;



const useStyles = makeStyles((theme) => ({
    button: {
        width: '100%',
        justifyContent: 'flex-start',
    },
    buttonBody: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'initial',
        width: '100%'
    },
    buttonSubtitle: {
        fontSize: '.72em'
    }
}));
