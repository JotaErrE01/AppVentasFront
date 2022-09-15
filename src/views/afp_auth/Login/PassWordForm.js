import React from 'react'
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import {
    Box,
    Grid,
    Button,
    makeStyles,
    IconButton,
    Typography
} from '@material-ui/core';
import renderTextField from '../../../components/FormElements/InputText';
import { Alert, AlertTitle } from '@material-ui/lab';
import LoadBounce from 'src/components/common/LoadBounce';
import { ArrowBack } from '@material-ui/icons';

const PasswordForm = ({ onSubmit,
    password_reset_error, password_reset_success, onChangeForm
}) => {
    const classes = useStyles();
    return (
        <Formik
            initialValues={{ usuario: '', password: '', passwordConfirm:'', submit: '' }}
            validationSchema={Yup.object().shape({
                usuario: Yup.string()
                    .max(255)
                    .required('Se requiere llenar este campo'),
                password: Yup.string()
                    .max(255)
                    .required('Se requiere llenar este campo'),
                passwordConfirm: Yup.string()
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
                            CAMBIAR CLAVE
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
                            
                            <Grid item md={12} xs={12} >
                                <Field
                                    error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
                                    helperText={touched.passwordConfirm && errors.passwordConfirm}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.passwordConfirm}
                                    label="Confirmar"
                                    name="passwordConfirm"
                                    id="passwordConfirm"
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
                                    <AlertTitle>Error al cambiar contraseña</AlertTitle>
                                    {/* Una o mas de sus credenciales de acceso es incorrecta <strong>Intentelo Nuevamente!</strong> */}
                                </Alert>
                            ) : ('')}
                        </Box>
                    )}

                    {
                        password_reset_error &&
                        <Box mt={3}>

                            <Alert severity="error">
                                <AlertTitle>{password_reset_error}</AlertTitle>
                                Intente nuevamente o reporte al administrador del sistema.
                            </Alert>

                        </Box>

                    }

                    {
                        password_reset_success &&
                        <Box mt={3}>

                            <Alert severity="success"
                                action={
                                    <Button color="inherit" size="small" onClick={onChangeForm}>
                                        Iniciar sesión
                                    </Button>
                                }
                            >
                                <AlertTitle>Contraseña actualizada con éxito</AlertTitle>
                            </Alert>

                        </Box>

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
                                    Confirmar
                                </Button>

                                : <LoadBounce load={isSubmitting} />
                        }
                    </Box>

                    <Box mt={3} display="flex" justifyContent="center">
                        <Button
                            className={classes.roundedButton}
                            color='secondary'
                            size="large"
                            variant="outlined"
                            onClick={onChangeForm}
                        >
                            <ArrowBack />
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default PasswordForm;



const useStyles = makeStyles(() => ({
    root: {
        width:'80%'
    },
    ButtonSesion: {
        padding: '.9em .3em',
        width: '100%'
    },
    roundedButton: {
        height: '60px',
        width: '60px',
        borderRadius: "9pt"
    },
    ButtonSessionContainer: {
        display: 'flex',
        justifyContent: 'center'
    }
}));