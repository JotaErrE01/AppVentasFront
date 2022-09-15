import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';
import {
  Box,
  Grid,
  Button,
  makeStyles
} from '@material-ui/core';
import useAuth from 'src/contextapi/hooks/useAuth';
import useIsMountedRef from 'src/contextapi/hooks/useIsMountedRef';
import { Alert, AlertTitle } from '@material-ui/lab';

import renderTextField from '../../../components/FormElements/InputText';
import LoadBounce from 'src/components/common/LoadBounce';

const useStyles = makeStyles(() => ({
  root: {},
  ButtonSesion: {
    padding:'.9em .3em',
    width:'100%'
  },
  ButtonSessionContainer: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

const JWTLogin = ({ className, ...rest }) => {
  const classes = useStyles();
  const { login } = useAuth();

  const auth = useAuth();
  const errorList = auth.errors;

  
  
  const isMountedRef = useIsMountedRef();

  const onSubmit = async (values, {
    setErrors,
    setStatus,
    setSubmitting
  }) => {
    try {
      await login(values.usuario, values.password);
      if (isMountedRef.current) {
        setStatus({ success: true });
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      if (isMountedRef.current) {
        setStatus({ success: false });
        setErrors({ submit: true });
        setSubmitting(false);
      }
    }
  }


  return (
    <Formik
      initialValues={{  usuario: null, password: null,submit: null }}
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
        <form noValidate onSubmit={handleSubmit} className={clsx(classes.root, className)} {...rest} >
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
                      color='primary'
                      size="large"
                      variant="contained"
                      type="submit"
                      >
                      Ingresar
                    </Button>
                    
                    : <LoadBounce load={isSubmitting} />
                }

            


          </Box>
        </form>
      )}
    </Formik>
  );
};

JWTLogin.propTypes = {
  className: PropTypes.string,
};

export default JWTLogin;
