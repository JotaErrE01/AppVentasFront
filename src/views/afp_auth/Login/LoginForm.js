import React from 'react'
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import {
    Box,
    Grid,
    Button,
    makeStyles,
    Typography
} from '@material-ui/core';
import renderTextField from '../../../components/FormElements/InputText';
import { Alert, AlertTitle } from '@material-ui/lab';
import LoadBounce from 'src/components/common/LoadBounce';

const LoginForm = ({ onSubmit, errorList, onChangeForm }) => {

    const classes = useStyles();

    return (
        <Formik
            initialValues={{ usuario: '', password: '', submit: '' }}
            validationSchema={Yup.object().shape({
                usuario: Yup.string()
                    .max(255)
                    .required('Se requiere llenar este campo'),
                password: Yup.string()
                    .max(255)
                    .required('Se requiere llenar este campo')
            })}
            onSubmit={onSubmit}
        >
            {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values
            }) => (
                <form noValidate onSubmit={handleSubmit} className={classes.root} >
                    <Box mt={3}>
                        <Typography variant="h4">
                            INICIAR SESIÓN
                        </Typography>
                    </Box>


                    <Box mt={3}>
                        <Grid container spacing={2} >
                            <Grid item md={12} xs={12} >
                                <Field
                                    error={Boolean(touched.usuario && errors.usuario)}
                                    helperText={touched.usuario && errors.usuario}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.usuario}
                                    label="Usuario"
                                    name="usuario"
                                    id="usuario"
                                    margin="normal"
                                    autoFocus
                                    component={renderTextField}
                                />
                            </Grid>
                            <Grid item md={12} xs={12} >
                                <Field
                                    error={Boolean(touched.password && errors.password)}
                                    helperText={touched.password && errors.password}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    label="Contraseña"
                                    name="password"
                                    id="password"
                                    margin="normal"
                                    type="password"
                                    component={renderTextField}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    {errors.submit && (
                        <Box mt={3}>
                            {(errors.submit === true) ? (
                                <Alert severity="error">
                                    <AlertTitle>Error al Iniciar Sesión</AlertTitle>
                                    Una o mas de sus credenciales de acceso es incorrecta <strong>Intentelo Nuevamente!</strong>
                                </Alert>
                            ) : ('')}
                        </Box>
                    )}

                    {
                        errorList && errorList.length && (
                            <Box mt={3}>
                                {(errorList.length) ? (
                                    <Alert severity="error">
                                        <AlertTitle>Error al Iniciar Sesión</AlertTitle>
                                        Su perfil de usuario no está copmleto.
                                    </Alert>
                                ) : ('')}
                            </Box>
                        )
                    }
                    <Box mt={3} display="flex" justifyContent="center">
                        {
                            !isSubmitting ?
                                <Button
                                    disabled={isSubmitting}
                                    className={classes.ButtonSesion}
                                    color='secondary'
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                >
                                    Ingresar
                                </Button>

                                : <LoadBounce load={isSubmitting} />
                        }
                    </Box>

                    <Box mt={3} display="flex" justifyContent="center">
                        <Button
                            disabled={isSubmitting}
                            className={classes.ButtonSesion}
                            color='secondary'
                            variant="outlined"
                            onClick={onChangeForm}
                        >
                            Cambiar contraseña
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default LoginForm



const useStyles = makeStyles(() => ({
    root: {
        width:'80%'

    },
    ButtonSesion: {
        padding: '.9em .3em',
        width: '100%'
    },
    ButtonSessionContainer: {
        display: 'flex',
        justifyContent: 'center'
    }
}));