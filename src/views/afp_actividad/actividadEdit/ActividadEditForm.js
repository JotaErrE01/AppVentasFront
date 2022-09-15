import React, { useState } from 'react';
import { Grid, makeStyles, TextField, Button, ButtonBase } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';

import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { Select, FormHelperText } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Formik } from 'formik';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";

import Pickactividad from 'src/views/afp_actividad/actividadEdit/Inputs/PickActividad'
//MODULES
import { useHistory } from 'react-router';
import _ from 'lodash';
import hash from 'object-hash';
import * as Yup from 'yup';
import TitleDescription from 'src/components/TitleDescription'

//LOCAL

//REDUX FN
import { useDispatch } from 'src/store';
import { createActividad, updateActividad } from 'src/slices/actividad';
import { useSnackbar } from 'notistack';

//CUSTOM HOOK
import useAuth from 'src/contextapi/hooks/useAuth';
import JSONTree from 'react-json-tree';

const useStyles = makeStyles((theme) => ({
    view: {
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'space-between',
        // height: '90vh'
    },

    actionsView: {
        // padding: '3em 0',
        // display: 'flex',
        // justifyContent: 'center',
        // flex: 1,
    },
    actionButton: {
        margin: theme.spacing(6),
        padding: theme.spacing(2),
        width: '30em',
    },
}));



const castDate = (fecha, hora) => {
    const _fecha = new Date(fecha);
    const _hora = new Date(hora);
    const datetime = new Date(
        DateFnsUtils.prototype.getYearText(_fecha),
        DateFnsUtils.prototype.getMonth(_fecha),
        DateFnsUtils.prototype.getDayText(_fecha),
        DateFnsUtils.prototype.getHourText(_hora),
        DateFnsUtils.prototype.getMinuteText(_hora),
        0, 0); // 1 Jan 2011, 00:00:00
    return datetime;
}

const castDateToText = (date) => {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const payload = date.toLocaleDateString('es-ES', options)
    return payload;
}


function ActividadEditForm({
    actividad, submitCb, className, actividades, prospectos,
    cliente, clienteSearch, clienteWait, clienteError }) {

    //CAT
    const _actividades = actividades;
    const _prospectos = prospectos;
    const _tipos_asignacion = ['prospecto'];
    //

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const [fecha, setFecha] = useState(new Date());
    const [hora, setHora] = useState(new Date());
    const [actividad_id, set_actividad_id] = useState()

    const isEdit = actividad && actividad.id && true;

    const initialValues = actividad && actividad.id

        //EDIT
        ? {
            "cliente_id": actividad.cliente_id,
            "tipo_asignacion": "prospecto",
            "prospecto_id": actividad.prospecto_id,
            "prospecto": actividad.prospecto,
            "fecha": actividad.meet.datetime,
            "hora": actividad.meet.datetime,
            "actividad_id":actividades && actividades.length &&  actividades[0].id,
            "prospecto_id":prospectos && prospectos.length &&  prospectos[0].id,
        }

        //NEW   

        : {
            "cliente_id": null,
            "tipo_asignacion": "prospecto",
            "prospecto_id": null,
            "prospecto": null,
            "fecha": null,
            "hora": null,
            "actividad_id":actividades && actividades.length &&  actividades[0].id,
            "prospecto_id":prospectos && prospectos.length &&  prospectos[0].id,



        }


    const validationSchema = Yup.object().shape({
        cliente_id: '',
        prospecto_id: '',
        tipo_asignacion: Yup.string().required('Este campo es obligatorio'),
        fecha: Yup.date().typeError('Debes ingersar una fecha valida'),
        hora: Yup.date().typeError('Debes ingersar una hora válida'),
        // actividad_id: ''
    });


    const onSubmit = (values, { setErrors, setStatus, setSubmitting }) => {

        

        setSubmitting(true);
        const { tipo_asignacion, prospecto_id, fecha, hora } = values
        if (prospecto_id || cliente.id) {
            const datetime = castDate(fecha, hora);
            const dateText = castDateToText(datetime);
            const payload = {
                ...values,
                "usuario_id": user.id,
                // "actividad_id": actividad_id,
                cliente_id: tipo_asignacion === 'cliente' ? cliente.id : null,
                prospecto_id: tipo_asignacion === 'prospecto' ? prospecto_id : null,
                "contenido_2": JSON.stringify({
                    host: user.usuario,
                    datetime: datetime,
                    dateText: dateText
                }),
                "contenido_3": hash({ datetime, prospecto_id, cliente_id: cliente.id })
            }
            


            



            isEdit
                ? dispatch(
                    updateActividad(
                        { id: actividad.id, ...payload },
                        enqueueSnackbar,
                        () => { setSubmitting(false); setStatus({ success: true }); history.push('/afp/actividad') }
                    ))
                : dispatch(createActividad(
                    payload,
                    enqueueSnackbar,
                    () => { setSubmitting(false); setStatus({ success: true }); history.push('/afp/actividad') }
                ));


        } else {

            enqueueSnackbar('Debe asignar una persona', { variant: 'error' })
            setSubmitting(false);
        }
    }


    return <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema} >
        {


            ({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) =>
                <form onSubmit={handleSubmit} className={classes.view} >


                    <Grid container spacing={3} className={classes.formView} >

                        {/* AGENDAR FIELDS */}

                        <Grid item xs={12} md={12}>
                            <TitleDescription title="Crear actividad" description="Agendar" />
                        </Grid>

                        <Grid item xs={12} md={12}>
                            {
                            
                   
                                <Pickactividad
                                    actividadId={values.actividad_id}
                                    actividadCb={
                                        value => setFieldValue("actividad_id", value)

                                    }
                                    actividades={_actividades} />
                               
                            }
                        </Grid>


                        <Grid item xs={6} md={6}>

                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    name="fecha"
                                    fullWidth
                                    error={Boolean(touched.fecha && errors.fecha)}
                                    helperText={
                                        touched.fecha && errors.fecha ? errors.fecha : ''
                                    }
                                    placeholder="dd/MM/yyyy"
                                    id="date-picker-dialog"
                                    label="Ingrese el día"
                                    inputVariant="outlined"
                                    format="dd/MM/yyyy"
                                    value={values.fecha}
                                    onBlur={handleBlur}
                                    onChange={
                                        value => setFieldValue("fecha", value)
                                    }

                                    KeyboardButtonProps={{ "aria-label": "cambiar fecha" }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardTimePicker
                                    name="hora"
                                    fullWidth
                                    error={Boolean(touched.hora && errors.hora)}
                                    helperText={
                                        touched.hora && errors.hora ? errors.hora : ''
                                    }
                                    placeholder="HH:mm"

                                    id="date-picker-dialog"
                                    label="Ingrese la hora"
                                    inputVariant="outlined"
                                    format="HH:mm"
                                    value={values.hora}
                                    onBlur={handleBlur}
                                    onChange={value => setFieldValue("hora", value)}
                                    KeyboardButtonProps={{ "aria-label": "cambiar hora" }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>





                        {/* ASINGAR FIELDS */}

                        <Grid item xs={12} md={12}>
                            <TitleDescription description="Asignar persona" />
                        </Grid>

                        {/** :: SELECCIONA TIPO PERSONA ::: */}
                        <Grid item xs={12} md={12}>
                            <FormControl variant="outlined" className={classes.formControl}
                                error={Boolean(touched.tipo_asignacion && errors.tipo_asignacion)}
                                onBlur={handleBlur}
                                style={{ width: "100%" }}
                            >
                                <InputLabel htmlFor="tipo-asignacion"> Tipo persona </InputLabel>
                                <Select
                                    name="tipo_asignacion"
                                    id="tipo_asignacion"
                                    native
                                    value={values.tipo_asignacion}
                                    onChange={handleChange}
                                    label="Asignar persona"
                                    inputProps={{ name: 'tipo_asignacion', id: 'outlined-age-native-simple' }}
                                    style={{ width: '100%' }}
                                >
                                    {_tipos_asignacion.map(item => <option value={item}>{item}</option>)}
                                </Select>


                                <FormHelperText>{
                                    Boolean(touched.tipo_asignacion && errors.tipo_asignacion)
                                        ? errors.tipo_asignacion
                                        : ''
                                }</FormHelperText>
                            </FormControl>
                        </Grid>



                        {/** ::  BUSQUEDA DE CLIENTE ::: */}

                        {
                            (values.tipo_asignacion === 'cliente') &&
                            <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="center"

                            >
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        id="cedula_cliente"
                                        name="cedula_cliente"
                                        error={clienteError}
                                        helperText={clienteError ? 'Cliente no existe' : ''}
                                        fullWidth
                                        label="Cedula"
                                        type="text"
                                        onBlur={() => clienteSearch(values.cedula_cliente)}
                                        onChange={handleChange}
                                        value={values.cedula_cliente}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: clienteWait && (
                                                <InputAdornment position="end">
                                                    <CircularProgress size={30} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <TextField
                                        fullWidth
                                        label="Cliente"
                                        name="cliente_id"
                                        type="text"
                                        onBlur={handleBlur}
                                        value={!clienteError ? (cliente.nombre_cliente + " " + cliente.apellido_cliente) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="outlined"
                                    />
                                </Grid>




                            </Grid>
                        }


                        {/** :: SELECCIONA PROSPECTO  ::: */}
                        {
                            (values.tipo_asignacion === 'prospecto') &&
                            <Grid item xs={12} md={12}>

                                <Autocomplete
                                    id="prospecto_id"
                                    name="prospecto_id"
                                    options={_prospectos}
                                    getOptionLabel={(option) => option.nombre_cliente}

                                    error={Boolean(touched.prospecto_id && errors.prospecto_id)}
                                    helperText={touched.prospecto_id && errors.prospecto_id ? errors.prospecto_id : ''}
                                    getOptionLabel={(option) => option.nombre_cliente + " " + option.apellido_cliente}
                                    onBlur={handleBlur}
                                    onChange={(event, newValue) => {
                                        setFieldValue("prospecto_id",
                                            newValue ? newValue.id : null
                                        )
                                        setFieldValue("cliente_id", null)
                                    }}
                                    renderInput={
                                        (params) =>
                                            <TextField {...params} onBlur={handleBlur} label="Prospecto" variant="outlined" />
                                    }
                                />
                            </Grid>

                            
                        }


                    </Grid>






                    <Grid
                        container
                        direction="column"
                        justify="flex-end"
                        alignItems="center"
                    >
                        <Grid item xs={12} md={12}>
                            <Button

                                size="large"
                                color="secondary"
                                variant="contained"
                                type="submit"
                                className={classes.actionButton}
                                disabled={isSubmitting} >
                                {isSubmitting ? 'Guardando' : 'Guardar'}

                            </Button>
                        </Grid>

                    </Grid>





                </form>
        }
    </Formik>


}

export default ActividadEditForm
