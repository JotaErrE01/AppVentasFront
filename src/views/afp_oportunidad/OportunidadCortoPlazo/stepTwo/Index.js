import React, { Fragment, useEffect } from 'react';
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
    TextField,
    makeStyles,
} from '@material-ui/core';
import usesStyles from '../usesStyles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// import TipoCuentaBancariaCB from '../../../JSON_CATALOGOS/TIPO_CUENTA_BANCARIA_CB';

import renderTextField from '../../../../components/FormElements/InputText';
import renderSelectField from '../../../../components/FormElements/InputSelect';
import { getCatalogoBancos, getCatalogoTipoCuentas } from 'src/slices/catalogos';
import { useDispatch, useSelector } from 'src/store';

const FormOCPStepTwo = ({ nextPage, previusPage, actionType }) => {
    const UsesStyles = { usesStyles };
    const classes = UsesStyles.usesStyles(); 
    const dispatch = useDispatch();
    
	let { bancos, tipoCuentas } = useSelector(
		(state) => state.catalogo
    );

	useEffect(
		() => {
			try {
                dispatch(getCatalogoBancos());    
                dispatch(getCatalogoTipoCuentas());                       
			} catch (err) {
				console.error(err);
			}
		},
		[ dispatch ]
    );

    const submitingNextPage = () => {
        nextPage();
    };

    const submitPreviusPage = () => {
        previusPage();
    };

    const valueIni = {
        ingresos_mensuales: '',
        egresos_mensuales: '',
        otros_ingresos: '',
        activos: '',
        pasivos: '',
        patrimonio: '',
        concepto_otros_ingresos: '',
        saldos_creditos: '',
        entidad_bancaria: '',
        tipo_cuenta: '',
        numero_cuenta: '',
        antiguedad_cuenta: '',
    };

    return (
        <Formik
            initialValues={valueIni}
            validationSchema={Yup.object().shape({
                ingresos_mensuales: Yup.string()
                    .matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten números y 2 decimales')
                    .nullable()
                    .required('Se requiere llenar este campo'),
                egresos_mensuales: Yup.string()
                    .matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten números y 2 decimales')
                    .nullable()
                    .required('Se requiere llenar este campo'),
                otros_ingresos: Yup.string()
                    .matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten números y 2 decimales')
                    .nullable(),
                activos: Yup.string()
                    .matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten números y 2 decimales')
                    .nullable()
                    .required('Se requiere llenar este campo'),
                pasivos: Yup.string()
                    .matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten números y 2 decimales')
                    .nullable()
                    .required('Se requiere llenar este campo'),
                patrimonio: Yup.string()
                    .matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten números y 2 decimales')
                    .nullable(),
                concepto_otros_ingresos: Yup.string()
                    .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales')
                    .nullable()
                    .when('otros_ingresos', (otros_ingresos, schema) => {
                        if (typeof otros_ingresos === 'string')
                            return schema
                                .required('Se requiere llenar este campo');

                        return schema;
                    }),
                saldos_creditos: Yup.string()
                    .matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten números y 2 decimales')
                    .nullable()
                    .required('Se requiere llenar este campo'),
                entidad_bancaria: Yup.string()
                    .nullable(),
                tipo_cuenta: Yup.string()
                    .nullable(),
                numero_cuenta: Yup.string()
                    .matches(/^[0-9]+$/gm, 'Solo se admiten números')
                    .nullable()
                    .required('Se requiere llenar este campo'),
                antiguedad_cuenta: Yup.string()
                    .matches(/^[0-9]+$/gm, 'Solo se admiten números')
                    .nullable(),
            })}

            onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
                try {
                //dispatch(postClientesCrear(values, step, cedulaCli));
                submitingNextPage();
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
                values }) => (
                <Fragment>
                    {isSubmitting ? (
                        <Box display="flex" justifyContent="center" my={5} >
                            <CircularProgress />
                        </Box>

                    ) : (
                        <form onSubmit={handleSubmit}>
                            {/* Card 1 */}
                            <Box mt={3}>
                                <Card>
                                    <CardHeader title="Situasión Económica" />
                                    <Divider />
                                    <CardContent>
                                        {/* Elemento 1 */}
                                        <Grid container spacing={2} >
                                            <Grid item md={4} xs={12} >
                                                <Field
                                                    error={Boolean(touched.ingresos_mensuales && errors.ingresos_mensuales)}
                                                    helperText={touched.ingresos_mensuales && errors.ingresos_mensuales}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.ingresos_mensuales}
                                                    label="Ingresos Mensual USD$"
                                                    name="ingresos_mensuales"
                                                    id="ingresos_mensuales"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                            <Grid item md={4} xs={12} >
                                                <Field
                                                    error={Boolean(touched.egresos_mensuales && errors.egresos_mensuales)}
                                                    helperText={touched.egresos_mensuales && errors.egresos_mensuales}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.egresos_mensuales}
                                                    label="Egresos Mensuales USD$"
                                                    name="egresos_mensuales"
                                                    id="egresos_mensuales"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                            <Grid item md={4} xs={12} >
                                                <Field
                                                    error={Boolean(touched.otros_ingresos && errors.otros_ingresos)}
                                                    helperText={touched.otros_ingresos && errors.otros_ingresos}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.otros_ingresos}
                                                    label="Otros Ingresos USD$"
                                                    name="otros_ingresos"
                                                    id="otros_ingresos"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                            <Grid item md={4} xs={12} >
                                                <Field
                                                    error={Boolean(touched.activos && errors.activos)}
                                                    helperText={touched.activos && errors.activos}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.activos}
                                                    label="ACTIVOS"
                                                    name="activos"
                                                    id="activos"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                            <Grid item md={4} xs={12} >
                                                <Field
                                                    error={Boolean(touched.pasivos && errors.pasivos)}
                                                    helperText={touched.pasivos && errors.pasivos}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.pasivos}
                                                    label="PASIVOS"
                                                    name="pasivos"
                                                    id="pasivos"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                            <Grid item md={4} xs={12} >
                                                <Field
                                                    error={Boolean(touched.patrimonio && errors.patrimonio)}
                                                    helperText={touched.patrimonio && errors.patrimonio}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.activos - values.pasivos}
                                                    label="PATRIMONIO"
                                                    name="patrimonio"
                                                    id="patrimonio"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                            <Grid item md={12} xs={12} >
                                                <TextField
                                                    error={Boolean(touched.concepto_otros_ingresos && errors.concepto_otros_ingresos)}
                                                    helperText={touched.concepto_otros_ingresos && errors.concepto_otros_ingresos}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.concepto_otros_ingresos}
                                                    label="Concepto Otros Ingresos"
                                                    name="concepto_otros_ingresos"
                                                    id="concepto_otros_ingresos"
                                                    multiline
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Box>

                            {/* Card 2 */}
                            <Box mt={3}>
                                <Card>
                                    <CardHeader title="Referencias Bancarias" />
                                    <Divider />
                                    <CardContent>
                                        {/* Elemento 1 */}
                                        <Grid container spacing={2} >
                                            <Grid item md={3} xs={12} >
                                                <Field
                                                    error={Boolean(touched.entidad_bancaria && errors.entidad_bancaria)}
                                                    helperText={touched.entidad_bancaria && errors.entidad_bancaria}
                                                    label="Entidad"
                                                    name="entidad_bancaria"
                                                    id="entidad_bancaria"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    data={bancos}
                                                    value={values.entidad_bancaria}
                                                    component={renderSelectField}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12} >
                                                <Field
                                                    error={Boolean(touched.tipo_cuenta && errors.tipo_cuenta)}
                                                    helperText={touched.tipo_cuenta && errors.tipo_cuenta}
                                                    label="Tipo de Cuenta"
                                                    name="tipo_cuenta"
                                                    id="tipo_cuenta"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    data={tipoCuentas}
                                                    value={values.tipo_cuenta}
                                                    component={renderSelectField}
                                                />
                                            </Grid>
                                            <Grid item md={2} xs={12} >
                                                <Field
                                                    error={Boolean(touched.antiguedad_cuenta && errors.antiguedad_cuenta)}
                                                    helperText={touched.antiguedad_cuenta && errors.antiguedad_cuenta}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.antiguedad_cuenta}
                                                    label="Antiguedad"
                                                    name="antiguedad_cuenta"
                                                    id="antiguedad_cuenta"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                            <Grid item md={2} xs={12} >
                                                <Field
                                                    error={Boolean(touched.numero_cuenta && errors.numero_cuenta)}
                                                    helperText={touched.numero_cuenta && errors.numero_cuenta}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.numero_cuenta}
                                                    label="Número"
                                                    name="numero_cuenta"
                                                    id="numero_cuenta"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                            <Grid item md={2} xs={12} >
                                                <Field
                                                    error={Boolean(touched.saldos_creditos && errors.saldos_creditos)}
                                                    helperText={touched.saldos_creditos && errors.saldos_creditos}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.saldos_creditos}
                                                    label="Saldos Créditos"
                                                    name="saldos_creditos"
                                                    id="saldos_creditos"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Box>

                            {/* botones */}
                            <Box mt={3}>
                                <Grid container>
                                    <Grid item md={12} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item md={6} xs={12} >
                                                <Button className={classes.ButtonBlack} onClick={submitPreviusPage} fullWidth size="large" type="button" variant="contained" >
                                                    <ArrowBackIcon /> Atrás
                                                </Button>
                                            </Grid>
                                            <Grid item md={6} xs={12} >
                                                <Button disabled={isSubmitting} className={classes.ButtonBlack} fullWidth size="large" type="submit" variant="contained" >
                                                    Continuar <ArrowForwardIcon />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>

                        </form>
                    )}
                </Fragment>

            )}
        </Formik>
    );
};


export default FormOCPStepTwo;
