import React, { useState } from 'react';
import { Button, Dialog, DialogContent, FormControl, InputLabel, Grid, Select, Slide, Typography, TextField, Divider, useMediaQuery, useTheme, InputAdornment }
    from '@material-ui/core';
import Buttons from 'src/components/common/Buttons';
import { Alert } from '@material-ui/lab';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { X } from 'react-feather';
import Nowloading from 'src/components/common/Nowloading';
import { DeleteRounded } from '@material-ui/icons';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const ModalCreate = ({

    id, // cc es edit 
    prospecto, // cc es edit

    modalCrear,

    onProspectoSubmit,
    catalogoOrigen,

    setModalDelete,
    setModalCrear,


}) => {

    const theme = useTheme();



    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const handleClose = () => {
        setModalCrear(false)
    }

    const handleSave = (values) => {
        onProspectoSubmit(values)
    }

    const iValues = {
        "nombre_cliente": "",
        "apellido_cliente": "",
        "correo_cliente": "",
        "numero_identificacion": "",
        "celular_cliente": "",
        "contacto_1": "",
        "contacto_2": "",
        "contacto_3": "",
        "contacto_adicional": "",

        "origen_id": "",
        ...prospecto // cc es edit 
    }



    return (


        <Dialog
            open={modalCrear}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            fullScreen={fullScreen}

        >

            {
                id && !prospecto.id ? <Nowloading /> :
                    <DialogContent>
                        <Formik
                            initialValues={iValues}
                            enableReinitialize={true}
                            validationSchema={Yup.object().shape({
                                nombre_cliente: Yup.string().min(3, 'Nombre muy corto').required('Este campo es obligatorio').nullable(),
                                apellido_cliente: Yup.string().min(3, 'Apellido muy corto').required('Este campo es obligatorio').nullable(),
                                correo_cliente: Yup.string().email('Se requiere un correo válido').required('Este campo es obligatorio').nullable(),
                                numero_identificacion: Yup.string().min(10, 'Ingrese identificación válida').nullable(),
                                celular_cliente: Yup.string().min(10, 'Ingrese un celular válido').nullable(),
                            })}
                            onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
                                handleSave(values);
                            }}
                        >
                            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) =>
                            (

                                <form onSubmit={handleSubmit}>


                                    <Grid container spacing={3}>

                                        <Grid item xs={12}>

                                            <Grid
                                                container
                                                direction="row"
                                                justify="space-between"
                                                alignItems="center"
                                            >
                                                <Grid item xs={6}>
                                                    <Typography variant="h4">
                                                        {id ? `Editar: ${id}` : ' Nuevo prospecto'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        endIcon={<DeleteRounded />}
                                                        onClick={() => setModalDelete(true)}>
                                                        Eliminar
                                                    </Button>
                                                </Grid>
                                            </Grid>


                                        </Grid>


                                        <Grid item xs={12}>
                                            <FormControl variant="filled" fullWidth>
                                                <InputLabel htmlFor="outlined-age-native-simple">
                                                    Origen
                                                </InputLabel>
                                                <Select
                                                    fullWidth
                                                    native
                                                    value={values.origen_id}
                                                    onChange={(e) => setFieldValue('origen_id', e.target.value)}
                                                    label="origen_id"
                                                >
                                                    <option aria-label="None" value="" />
                                                    {
                                                        catalogoOrigen.map(item => (
                                                            <option key={item.id} value={item.id}>{item.contenido}</option>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>





                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(touched.nombre_cliente && errors.nombre_cliente)}
                                                fullWidth
                                                helperText={touched.nombre_cliente && errors.nombre_cliente && errors.nombre_cliente}
                                                label="Nombres"
                                                name="nombre_cliente"
                                                type="text"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.nombre_cliente}
                                                variant="filled"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(touched.apellido_cliente && errors.apellido_cliente)}
                                                fullWidth
                                                helperText={touched.apellido_cliente && errors.apellido_cliente
                                                    ? errors.apellido_cliente
                                                    : ''
                                                }
                                                label="Apellidos"
                                                name="apellido_cliente"
                                                type="text"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.apellido_cliente}
                                                variant="filled"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(touched.correo && errors.correo)}
                                                fullWidth
                                                helperText={touched.correo && errors.correo && errors.correo}
                                                label="Correo"
                                                name="correo_cliente"
                                                type="text"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.correo_cliente}
                                                variant="filled"
                                            />
                                        </Grid>



                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(touched.numero_identificacion && errors.numero_identificacion)}
                                                fullWidth
                                                helperText={touched.numero_identificacion && errors.numero_identificacion && errors.numero_identificacion}
                                                label="Cédula/pasaporte"
                                                name="numero_identificacion"
                                                type="text"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.numero_identificacion}
                                                variant="filled"
                                                InputProps={{ endAdornment: <InputAdornment position="end">opcional</InputAdornment> }}

                                            />
                                        </Grid>


                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(touched.celular_cliente && errors.celular_cliente)}
                                                fullWidth
                                                helperText={touched.celular_cliente && errors.celular_cliente && errors.celular_cliente}
                                                label="Celular"
                                                name="celular_cliente"
                                                type="text"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.celular_cliente}
                                                variant="filled"
                                                InputProps={{ endAdornment: <InputAdornment position="end">opcional</InputAdornment> }}

                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(touched.contacto_adicional && errors.contacto_adicional)}
                                                fullWidth
                                                helperText={touched.contacto_adicional && errors.contacto_adicional && errors.contacto_adicional}
                                                label="contacto_adicional"
                                                name="contacto_adicional"
                                                type="text"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.contacto_adicional}
                                                variant="filled"
                                                InputProps={{ endAdornment: <InputAdornment position="end">opcional</InputAdornment> }}

                                            />
                                        </Grid>


                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(touched.contacto_2 && errors.contacto_2)}
                                                fullWidth
                                                helperText={touched.contacto_2 && errors.contacto_2 && errors.contacto_2}
                                                label="Contacto 1"
                                                name="contacto_1"
                                                type="text"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.contacto_1}
                                                variant="filled"
                                                InputProps={{ endAdornment: <InputAdornment position="end">opcional</InputAdornment> }}

                                            />
                                        </Grid>


                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(touched.contacto_2 && errors.contacto_2)}
                                                fullWidth
                                                helperText={touched.contacto_2 && errors.contacto_2 && errors.contacto_2}
                                                label="Contacto 2"
                                                name="contacto_2"
                                                type="text"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.contacto_2}
                                                variant="filled"
                                                InputProps={{ endAdornment: <InputAdornment position="end">opcional</InputAdornment> }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(touched.contacto_3 && errors.contacto_3)}
                                                fullWidth
                                                helperText={touched.contacto_3 && errors.contacto_3 && errors.contacto_3}
                                                label="Contacto 3"
                                                name="contacto_3"
                                                type="text"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.contacto_3}
                                                variant="filled"
                                                InputProps={{ endAdornment: <InputAdornment position="end">opcional</InputAdornment> }}

                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button
                                                onClick={handleClose}
                                                size="large"
                                                color="secondary"
                                                variant="outlined"
                                                fullWidth
                                            >
                                                Cancelar
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                size="large"
                                                color="secondary"
                                                variant="contained"
                                                fullWidth
                                            >
                                                Guardar
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {/* <Divider /> */}
                                        </Grid>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    </DialogContent>

            }
        </Dialog>
    )

}

export default ModalCreate;