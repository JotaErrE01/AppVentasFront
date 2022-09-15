import React, { useEffect } from 'react'
import { Avatar, List, ListSubheader, Box, ListItem, ListItemAvatar, ListItemText, Link, ListItemSecondaryAction, IconButton, Button } from '@material-ui/core'
import PerfectScrollbar from 'react-perfect-scrollbar';
import { getSalas } from 'src/slices/sala';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'src/store';
import { Link as RouterLink } from 'react-router-dom';
import { Airplay, Edit, Edit2, Edit3 } from 'react-feather';
import { ViewStreamOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import useAuth from 'src/contextapi/hooks/useAuth';





const useStyles = makeStyles((theme) => ({
    iconButton: {
        fontSize: '.9em'
    }
}));
const RoomsList = () => {



    const classes = useStyles();

    const { user } = useAuth();

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getSalas(enqueueSnackbar))
    }, [dispatch]);


    const coreSala = useSelector(state => state.coreSala)
    const coreSalaArr = (coreSala && coreSala.coreSalaArr && coreSala.coreSalaArr.length) ? coreSala.coreSalaArr : [];

    return (
        <List
            subheader={
                <Box p={2}>
                    <ListSubheader disableGutters >
                        SALAS DE VENTA
                    </ListSubheader>
                </Box>
            }>
            <PerfectScrollbar options={{ suppressScrollX: true }}>

                {

                    coreSalaArr.map(item => (

                        <ListItem
                            key={item.id}
                        // component={RouterLink}

                        // to={`/afp/room/${item.id}`}
                        >
                            <ListItemAvatar>
                                <Avatar> {item.title[0]} </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.title}
                                primaryTypographyProps={{
                                    noWrap: true,
                                    variant: 'h6',
                                    color: 'textPrimary'
                                }}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    component={RouterLink}
                                    key={item.id}
                                    to={`/afp/room/${item.id}`}
                                >
                                    <Edit2 size={15} />
                                </IconButton>
                                <IconButton
                                    component={RouterLink}
                                    key={item.id}
                                    to={`/rooms/${item.id}/${user.usuario}`}
                                >
                                    <Airplay size={15} />
                                </IconButton>
                            </ListItemSecondaryAction>






                        </ListItem>

                    ))
                }

                <Box p={2}>

                    <ListItem >
                        <Button
                            component={RouterLink}
                            to={`/afp/room/new`}
                            fullWidth variant="contained" color="primary" size="small">Nueva</Button>
                    </ListItem>
                </Box>

            </PerfectScrollbar>

        </List>
    )
}


export default RoomsList;