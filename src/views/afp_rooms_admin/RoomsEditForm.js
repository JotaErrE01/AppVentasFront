import React, { useState } from 'react';
import * as Yup from 'yup';
import { Typography, Grid, TextField, FormControl, InputLabel, Select, ListItem, List, Chip, Box, makeStyles, Card, CardActions, Divider, CardHeader, IconButton, Paper, CircularProgress } from '@material-ui/core';
import { Formik } from 'formik';
import JSONTree from 'react-json-tree';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FilterUsers from 'src/views/afp_rooms_admin/FormInputs/FilterUsers';
import SaveIcon from '@material-ui/icons/Save';
import { isDirty, submit } from 'redux-form';
import LoadSpinner from 'src/components/LoadSpinner';
import LoadBounce from 'src/components/common/LoadBounce';

const RoomsEditForm = ({
    sala,
    catalogoUsers,
    handleSave,


    participants,
    setParticipants,
    handleSaveUsers
}) => {

    const classes = useStyles();





    const config = {

        formValues:
            (sala && sala.id)
                ? { ...sala }
                : {
                    "title": null,
                    "description": null,
                    "host_id": null,
                    "host_id_temp": null
                },
        validationSchema: Yup.object().shape({
            title: Yup.string().min(3, 'Nombre muy corto').required('Este campo es obligatorio').nullable(),
            description: Yup.string().min(3, 'Descripcion muy corta').required('Este campo es obligatorio').nullable(),

            host_id: Yup.string().required('Host es requerido'),

        }),

    }

    const onSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        handleSave(values, () => setSubmitting(false));
    }







    return (
        <>

            <Paper className={classes.paper}>

                <Formik
                    enableReinitialize
                    initialValues={config.formValues}
                    onSubmit={onSubmit}
                    validationSchema={config.validationSchema}
                >
                    {
                        ({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values, isValid, dirty }) =>
                            <form onSubmit={handleSubmit}>


                                <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                                    <Typography variant="h3">
                                        {values.title}
                                    </Typography>
                                    <Button
                                        type="submit"
                                        disabled={!(isValid && dirty)}
                                        variant="contained" color="primary" size="small" className={classes.button}
                                        startIcon={ isSubmitting ? <CircularProgress size={15} color="#ffffff"/> : <SaveIcon />}>
                                        Guardar
                                    </Button>
                                </Box>
                                <Box marginTop={2} marginBottom={2}>
                                    <Divider />
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            fullWidth
                                            label="Sala"
                                            type="text"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            variant="outlined"
                                            name="title"
                                            value={values.title}
                                            error={Boolean(touched.title && errors.title)}
                                            helperText={touched.title && errors.title}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Descripcion"
                                            type="text"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            variant="outlined"
                                            name="description"
                                            value={values.description}
                                            error={Boolean(touched.description && errors.description)}
                                            helperText={touched.description && errors.description}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Host"
                                            variant="outlined"
                                            onChange={e => setFieldValue("host_id", e.target.value)}


                                            name="host_id"
                                            value={values.host_id}
                                            error={Boolean(touched.host_id && errors.host_id)}
                                            helperText={touched.host_id && errors.host_id}
                                        >
                                            {
                                                catalogoUsers.map(item =>
                                                    <MenuItem
                                                        key={item.id}
                                                        value={item.id}>
                                                        {item.name}
                                                    </MenuItem>
                                                )
                                            }
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            select
                                            label="Host asignado"
                                            variant="outlined"
                                            name="host_id_temp"
                                            value={values.host_id_temp}
                                            onChange={e => setFieldValue("host_id_temp", e.target.value)}
                                            fullWidth
                                        >
                                            {
                                                catalogoUsers.map(item =>
                                                    <MenuItem
                                                        key={item.id}
                                                        value={item.id}>
                                                        {item.name}
                                                    </MenuItem>
                                                )
                                            }
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </form>
                    }
                </Formik>
            </Paper>


            <Paper className={classes.paper}>
                <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                    <Typography variant="h3">
                        Integrantes
                    </Typography>
                    <Button
                        onClick={() => handleSaveUsers()}

                        variant="contained" color="primary" size="small" className={classes.button} startIcon={<SaveIcon />}>
                        Guardar
                    </Button>
                </Box>
                <Box marginTop={2} marginBottom={2}>
                    <Divider />
                </Box>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        {
                            catalogoUsers.length ?

                                <FilterUsers
                                    options={catalogoUsers}
                                    participants={participants}
                                    setParticipants={setParticipants}
                                />

                                : <></>
                        }

                    </Grid>
                </Grid>
            </Paper>

        </>
    )
}

export default RoomsEditForm;

const useStyles = makeStyles((theme) => ({
    chip: {
        margin: theme.spacing(1)
    },
    paper: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    }
}));




