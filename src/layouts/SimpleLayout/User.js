import React from 'react'
import {
    Avatar,
    Grid,
    Box,
    Collapse,
    List,
    ListItem,
    ListItemText,
    Typography,
    Button,
    ButtonBase,
    Drawer
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


import { ExpandMore, ExpandLess, ArrowDropDown, ArrowDropUp, ExitToApp } from '@material-ui/icons';
import useAuth from 'src/contextapi/hooks/useAuth';
import JSONTree from 'react-json-tree';
import { useHistory } from 'react-router';
import { LogOut } from 'react-feather';

const useStyles = makeStyles((theme) => ({
    txt: {
        color: 'white'
    },


    nested: {
        paddingLeft: theme.spacing(4),
    },
    nestedButton: {
        padding: theme.spacing(4),
        display: 'flex',
        justifyContent: 'center'
    }
}));


const User = () => {
    const classes = useStyles();

    const { user, logout } = useAuth();
    const history = useHistory();

    const [open, setOpen] = React.useState(false);

    const expandirUsuario = () => {
        setOpen(!open);
    };


    const handleLogout = async () => {
        try {
            await logout();
            history.push('/');
        } catch (err) {
            console.error(err);
        }
    };




    // Extraer nombre para mostraar e inicial
    let display = user.name.split(" ");
    
    let inicial = display[2][0];
    display = `${display[2]} ${display[0]}`;




    return (
        <div >

            <ButtonBase
                onClick={() => setOpen(!open)}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%', gap: '.6em' }}>

                <Avatar aria-label="usuario">  {inicial} </Avatar>

                <Typography variant="subtitle1" className={classes.txt}>
                    {display}
                </Typography>

            </ButtonBase>

            <Drawer
                open={open}
                onClose={() => setOpen(!open)}
                anchor="right"
            >

                    <List component="div" disablePadding>
                        <ListItem className={classes.nested}>
                            <ListItemText primary={user.descripcion_cargo} secondary="CARGO" />
                        </ListItem>
                        <ListItem className={classes.nested}>
                            <ListItemText primary={user.usuario} secondary="USUARIO" />
                        </ListItem>
                        <ListItem className={classes.nested}>
                            <ListItemText primary={user.codigo_empleado} secondary="CÓDIGO DE EMPLEADO" />
                        </ListItem>


                        <ListItem className={classes.nestedButton}>
                            <Button variant="outlined" secondary fullWidth onClick={handleLogout}>
                                Cerrar sesión
                            </Button>
                        </ListItem>

                        <ListItem className={classes.nested}>

                        </ListItem>


                    </List>

            </Drawer>
        </div>

    )
}

export default User
