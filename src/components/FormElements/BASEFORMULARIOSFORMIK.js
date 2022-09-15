import React, { Fragment } from 'react';
import * as Yup from 'yup';
import { Formik, Field  } from 'formik';
import {
    Box,
    Grid,
    Button,
    CircularProgress,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Typography,
    makeStyles,
} from '@material-ui/core';

import renderTextField from '../../../../components/FormElements/InputText';
import renderSelectField from '../../../../components/FormElements/InputSelect';
import renderDateTimePicker from '../../../../components/FormElements/InputDate';

const useStyles = makeStyles((theme) => ({
        nombreclase: {
            // estilos SASS
        },
    }));

const NAMEFILE = () => {
    const classes = useStyles();
    const valueIni = {

    };
    return (
        <Formik
            initialValues={valueIni}
            validationSchema={Yup.object().shape({
            })}

            onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
                try {
                //dispatch(postClientesCrear(values, step, cedulaCli));
                setStatus({ success: true });
                setSubmitting(false);
                } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
                }
            }}
        >

            {({ errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                setFieldValue,
                values }) => (
                <Fragment>
                    {isSubmitting ? (
                        <Box display="flex" justifyContent="center" my={5} >
                            <CircularProgress />
                        </Box>

                    ) : (
                        <form onSubmit={handleSubmit}>

                        </form>
                    )}
                </Fragment>

            )}
        </Formik>
    );
};


export default NAMEFILE;
