import React, { useEffect, useState } from 'react';
import RoomsEditForm from './RoomsEditForm';
import { Link as RouterLink, useHistory, useParams } from 'react-router-dom';
import {
    Container,
    Breadcrumbs,
    Button,
    Grid,
    Link,
    SvgIcon,
    Typography,
    makeStyles,
    Dialog,
    DialogContent,
    DialogActions,
    Box,
    Slide
} from '@material-ui/core';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import {
    Edit as EditIcon,
    Plus as isCreateIcon
} from 'react-feather';

import Page from 'src/components/Page';
import Buttons from 'src/components/common/Buttons'

import { deleteSala, getSala, postSala, putSala } from 'src/slices/sala';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'src/store';
import Nowloading from 'src/components/common/Nowloading';
import { getCatalogoUsers, postSalaUser, getSalaUsers, deleteSalaUser } from 'src/slices/salaUsers';
import JSONTree from 'react-json-tree';

const RoomsView = () => {
    const classes = useStyles();

    //::PARAMS
    const params = useParams();
    const id = params.id

    const isCreate = params.id === 'new' ? true : false;


    //::API REST
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory()

    useEffect(() => {
        dispatch(getCatalogoUsers(enqueueSnackbar));
        dispatch(getSalaUsers(enqueueSnackbar, id));

        !isCreate && dispatch(getSala(enqueueSnackbar, id));

    }, [dispatch, id]);


    const handleSave = (body, cb) => {
        isCreate ?
            dispatch(postSala(enqueueSnackbar, body, cb))
            : dispatch(putSala(enqueueSnackbar, body, cb))
    }
    const handleDelete = () => {
        dispatch(deleteSala(enqueueSnackbar, params.id, () => history.push('/')));
    }

    ///::



    const _catalogoUsers = useSelector(state => state.salaUser ? state.salaUser.catalogoUsers : []);
    const _salaUsers = useSelector(state => state.salaUser ? state.salaUser.salaUsers : []);
    const _sala = useSelector(state => state.sala ? state.sala : null);


    const [participants, setParticipants] = useState(false);

    const handleSaveUsers = () => {

        const callback = () => {
            dispatch(getSalaUsers(enqueueSnackbar, id));
        }

        if (!participants) {
            return;
        }

        const initialUsersId = _salaUsers.map(item => item.id);
        const currentUsersId = participants.map(item => item.id);
        const diffIds = initialUsersId.filter(x => !currentUsersId.includes(x));
        const addIds = currentUsersId.filter(x => !initialUsersId.includes(x));


        if (addIds.length) {

            const payload = {
                "sala_id": params.id,
                "users": addIds
            };
            dispatch(postSalaUser(enqueueSnackbar, payload, () => { }));
        }


        if (diffIds.length) {
            
            const salasHasUsersId = diffIds.map((key, index) => _salaUsers[index].salaHasUsers);
            const payload = {
                "sala_id": params.id,
                "salaHasUsers": salasHasUsersId
            };
            dispatch(deleteSalaUser(enqueueSnackbar, payload, () => { }));
        }



    }



    return (
        <Wrap handleDelete={handleDelete}>
            {
                _sala.loadingSala
                    ? <Nowloading />
                    : (_sala.sala && !isCreate) && <RoomsEditForm
                        sala={_sala.sala}
                        catalogoUsers={_catalogoUsers}
                        handleSave={handleSave}
                        participants={participants ? participants : _salaUsers}
                        setParticipants={setParticipants}
                        handleSaveUsers={handleSaveUsers}
                    />

            }
            {
                isCreate
                && <RoomsEditForm
                    catalogoUsers={_catalogoUsers}
                    handleSave={handleSave}
                    participants={participants ? participants : _salaUsers}
                    setParticipants={setParticipants}
                    handleSaveUsers={handleSaveUsers}
                />

            }



        </Wrap>
    )
};

export default RoomsView;



//::



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const Wrap = ({ children, handleDelete }) => {
    const classes = useStyles();

    const [dialog, setDialog] = useState(false)

    return (

        <Page
            className={classes.root}
            title="Ventas | Actividades" >

            <Container maxWidth="xl">

                <Grid container spacing={3} justify="space-between">
                    <Grid item>
                        <Typography variant="h3" color="textPrimary">
                            Salas de ventas
                        </Typography>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                            <Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
                                Ventas
                            </Link>
                            <Link variant="body1" color="inherit" to="#" component={RouterLink}>
                                Salas de venta
                            </Link>
                        </Breadcrumbs>
                    </Grid>

                    <Grid item>
                        <Buttons onClick={() => setDialog('ELIMINAR')} >
                            Eliminar
                        </Buttons>
                    </Grid>
                </Grid>


                <Dialog
                    open={dialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setDialog(false)}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent style={{ marginBottom: '1.2em' }}>

                        <Box p={3}>
                            <Typography variant='h5'>
                                ¿Está seguro de querer eliminar la sala ?
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialog(false)} color="primary">
                            NO
                                    </Button>
                        <Button onClick={handleDelete} color="primary">
                            SI
                         </Button>

                    </DialogActions>


                </Dialog>






                {children}


            </Container>

        </Page>

    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

}));

