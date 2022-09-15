import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, TextField } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';
import { getTipoAfiliaciones } from 'src/slices/tipoAfiliacion';
import CircularProgress from '@material-ui/core/CircularProgress';
import JSONTree from 'react-json-tree';
import { Alert } from '@material-ui/lab';
import TitleDescription from 'src/components/TitleDescription';
import { ArrowBack } from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
    },
    input: {
        // marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    alert: {
        marginBottom: theme.spacing(2)
    }
}));

export default function HandleSearch({
    onChange
}) {
    const classes = useStyles();

    useEffect(() => {
        set_numero_identificacion(null)
    }, [])

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [numero_identificacion, set_numero_identificacion] = useState(null)

    const [clean, setClean] = useState(true);

    const tipoAfiliacion = useSelector(state => state.tipoAfiliacion);


    const { tipoAfiliaciones, loading, error } = tipoAfiliacion;


    const handleSearch = (numero_identificacion) => {
        setClean(false)

        numero_identificacion && dispatch(getTipoAfiliaciones(enqueueSnackbar, numero_identificacion));
    }



    const handleChange = (value) => {
        set_numero_identificacion(value);
        onChange(value)
    }

    return (

        <>

            {
                tipoAfiliaciones &&
                    tipoAfiliaciones.length &&
                    !clean

                    ?

                    <>
                        <TitleDescription title="Cliente encontrado" description="Status del cliente" />

                        { tipoAfiliaciones.map(item =>
                            (<Alert className={classes.alert} severity={item.status}><strong>{item.fondo_contenido}</strong>— {item.contenido}</Alert>)
                        )}


                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<ArrowBack />}
                            onClick={() => setClean(true)}
                        >
                            Buscar otro
                        </Button>
                    </>

                    :

                    <>

                        <TitleDescription title="Consultar" description="Consultar status del cliente" />

                        <Box component="form" className={classes.root}>
                            <TextField
                                fullWidth
                                label="Cédula/pasaporte"
                                name="nombre_cliente"
                                type="text"
                                onBlur={() => { }}
                                onChange={e => handleChange(e.target.value)}
                                value={numero_identificacion}
                                variant="outlined"
                            />

                            <Divider className={classes.divider} orientation="vertical" />

                            <IconButton
                                onClick={() => handleSearch(numero_identificacion)}
                                color="primary" className={classes.iconButton} aria-label="directions">
                                {
                                    loading ? <CircularProgress size={27} /> : <SearchIcon />
                                }
                            </IconButton>

                        </Box>

                    </>
            }








        </>
    );
}
