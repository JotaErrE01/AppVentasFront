import React, { Fragment } from 'react'
import OportunidadesGrid from './OportunidadesGrid'


//REDUX FN
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';
import { getOportunidades } from 'src/slices/oportunidad';
import { Backdrop, Box, Button, ButtonGroup, CircularProgress, ClickAwayListener, Container, Grid, Grow, ListItem, ListItemIcon, ListItemText, makeStyles, MenuItem, MenuList, Paper, Popper, Typography } from '@material-ui/core';
import { Filter as FilterIcon } from 'react-feather';
import useAuth from 'src/contextapi/hooks/useAuth';

const tipoFondo = [
    'Largo plazo',
    'Corto plazo'
];

const Oportunidades = ({ setEdit }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const _oportunidad = useSelector(state => state.oportunidad);
    const [pagination, setPagination] = useState({ skip: 0, take: 10 });
    const [sortModel, setSortModel] = useState(
       [ { field: 'created_at', sort: 'desc' }]
    );
    
    const [fondoSelected, setFondoSelected] = useState(tipoFondo[0]);
    const [openSelect, setOpenSelect] = useState(false);
    const anchorRef = React.useRef(null);

    const { user } = useAuth();
    const { permisos } = user;

    const isAprobador = permisos.find(item=>item.guard === "endorse_sale")


    useEffect(() => {
        dispatch((getOportunidades(
            enqueueSnackbar,
            pagination,
            sortModel
        )));
    }, [dispatch, pagination]);


    if (_oportunidad.error) {
        return <div>ERROR</div>
    }


    const onPageChange = (e) => {
        const payload = {
            skip: (e.page - 1) * 10,
            take: 10
        }
        console.log(payload)
        setPagination(payload)
    };    

    const handleMenuItemClick = (fondoDesc) => {
        setFondoSelected(fondoDesc);
        setOpenSelect(false);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
  
      setOpenSelect(false);
    };

    const SelectTipoFondo = () => {
        return (
            <div style={{ marginTop: '1rem', marginBottom: '.6rem' }}>
                <Grid container>
                    <Grid item md="4">
                        <ListItem>
                            <ListItemIcon>
                                <FilterIcon />
                            </ListItemIcon>
                            <ListItemText
                                primaryTypographyProps={{
                                    variant: 'h4'
                                }}
                                primary="Tipo de fondo"
                            />
                        </ListItem>
                    </Grid>
                    <Grid item md="3" alignItems="center">
                        <Box display="flex" alignItems="center" css={{ height: '100%' }}>
                            <ButtonGroup
                                color="primary"
                                size="small"
                                aria-label="small outlined primary button group"
                            >
                                {tipoFondo.map(tipo =>
                                    tipo == fondoSelected ? (
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={() =>
                                                handleMenuItemClick(tipo)
                                            }
                                        >
                                            {tipo}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                handleMenuItemClick(tipo)
                                            }
                                        >
                                            {tipo}
                                        </Button>
                                    )
                                )}
                            </ButtonGroup>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        );
    };

    return !isAprobador ? (
        <OportunidadesGrid
            onPageChange={onPageChange}
            rows={_oportunidad.rows}
            loading={_oportunidad.loading}
            setEdit={setEdit}
            data={_oportunidad.oportunidades}
            sort={{ sortModel, setSortModel }}
        />
    ) : (
        <Fragment>
            <SelectTipoFondo />
            {fondoSelected == 'Largo plazo' ? (
                <OportunidadesGrid
                    onPageChange={onPageChange}
                    rows={_oportunidad.rows}
                    loading={_oportunidad.loading}
                    setEdit={setEdit}
                    data={_oportunidad.oportunidades.filter(
                        op => op.fondo_id == '000001'
                    )}
                    sort={{ sortModel, setSortModel }}
                    isAprobador={isAprobador}
                />
            ) : (
                <OportunidadesGrid
                    onPageChange={onPageChange}
                    rows={_oportunidad.rows}
                    loading={_oportunidad.loading}
                    setEdit={setEdit}
                    data={_oportunidad.oportunidades.filter(
                        op => op.fondo_id != '000001'
                    )}
                    sort={{ sortModel, setSortModel }}
                    isAprobador={isAprobador}
                />
            )}
        </Fragment>
    );


}

export default Oportunidades

