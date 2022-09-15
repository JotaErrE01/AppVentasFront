import React, { useState, Fragment, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Field, FieldArray  } from 'formik';
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
    FormControl,
} from '@material-ui/core';
import usesStyles from '../usesStyles';
import { Alert } from '@material-ui/lab';
import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

// import CodigoPaisCP from '../../../JSON_CATALOGOS/CODIGO_PAIS_CP';
// import BancosCB from '../../../JSON_CATALOGOS/BANCOS_CB';
// import TipoCuentaBancariaCB from '../../../JSON_CATALOGOS/TIPO_CUENTA_BANCARIA_CB';

import renderTextField from '../../../../components/FormElements/InputText';
import renderSelectField from '../../../../components/FormElements/InputSelect';
import renderDateTimePicker from '../../../../components/FormElements/InputDate';
import { getCatalogoPaises, getCatalogoBancos, getCatalogoProvincias, getCatalogoAeInversion } from 'src/slices/catalogos';
import Autocomplete from '@material-ui/lab/Autocomplete';

export class Friend {
  constructor() {
    this.name = "";
    this.email = "";
    this.includeAge = false;
    this.age = null;
  }
}

const defaultState = {
    nombresBeneficiarios: '',
    apellidosBeneficiarios: '',
    numero_identificacionBeneficiario: '',
    fecha_expiracion_documentoBeneficiarios: new Date(),
    nacionalidadBeneficiarios: 'EC',
    otraNacionalidBeneficiario2: 'EC',
    otraNacionalidBeneficiario3: 'EC',
    otraNacionalidBeneficiario4: 'EC',
};

const FormOCPStepOne = ({ nextPage, actionType }) => {
    const UsesStyles = { usesStyles };
    const classes = UsesStyles.usesStyles();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const [cantBeneficiarios, setcantBeneficiarios] = useState(0);
    const tipoFondo = useSelector((state) => state.cliente.tipoFondo);
    const _catAeinversion = useSelector(state => state.catalogo._catAeinversion)

    const [showNacionalidad2, setShowNacionalidad2] = useState("" ? true : false);
    const [showNacionalidad3, setShowNacionalidad3] = useState("" ? true : false);
    const [showNacionalidad4, setShowNacionalidad4] = useState("" ? true : false);

    const [FormaAbonoC, setFormaAbono] = useState('MENSUAL');
    const handleChangeFormaAbono = (valChange, values) => {
        setFormaAbono(valChange);
        values.actividad_economica = valChange;
    };    
    
	let { paises, bancos, tipoCuentas } = useSelector(
		(state) => state.catalogo
    );
    

	useEffect(
		() => {
			try {
                dispatch(getCatalogoPaises());     
                dispatch(getCatalogoProvincias());  
                dispatch(getCatalogoBancos());        
                dispatch(getCatalogoAeInversion())
               
			} catch (err) {
				console.error(err);
			}
		},
		[ dispatch ]
    );

    var colorButtonMEN = '';
    var colorButtonTRI = '';
    var colorButtonSEM = '';

    if (FormaAbonoC == 'MENSUAL') {
        colorButtonMEN = classes.ColorButtonOnSelect;
        colorButtonTRI = classes.ColorButtonOffSelect;
        colorButtonSEM = classes.ColorButtonOffSelect;
    } else if (FormaAbonoC == 'TRIMESTRAL') {
        colorButtonTRI = classes.ColorButtonOnSelect;
        colorButtonMEN = classes.ColorButtonOffSelect;
        colorButtonSEM = classes.ColorButtonOffSelect;
    } else if (FormaAbonoC == 'SEMESTRAL') {
        colorButtonSEM = classes.ColorButtonOnSelect;
        colorButtonMEN = classes.ColorButtonOffSelect;
        colorButtonTRI = classes.ColorButtonOffSelect;
    }

    const handleOnAdd = push => {
        if (cantBeneficiarios < 3) {
            push(defaultState);
            setcantBeneficiarios(cantBeneficiarios + 1);
        } else {
            enqueueSnackbar('No puede agregar más de 4 beneficiarios', {
                variant: 'error'
            });
        }
    };

    const deleteNacionalidad2 = (setFieldValue) => {
        setShowNacionalidad2(false);
        setFieldValue('otraNacionalidBeneficiario2', '', false);
    };
    const deleteNacionalidad3 = (setFieldValue) => {
        setShowNacionalidad3(false);
        setFieldValue('otraNacionalidBeneficiario3', '', false);
    };
    const deleteNacionalidad4 = (setFieldValue) => {
        setShowNacionalidad4(false);
        setFieldValue('otraNacionalidBeneficiario4', '', false);
    };
    const agregarNacionalidad = (index) => {
        if (showNacionalidad2 == false) {
            setShowNacionalidad2(true);
        } else if (showNacionalidad3 == false) {
            setShowNacionalidad3(true);
        } else if (showNacionalidad4 == false) {
            setShowNacionalidad4(true);
        } else {
            enqueueSnackbar('No puede agregar más de 4 nacionalidades', {
                variant: 'error'
            });
        }
    };

    const handleOnRemove = (remove, index) => {
        if (cantBeneficiarios >= 1) {
            remove(index);
            setcantBeneficiarios(cantBeneficiarios - 1);
        }
    };

    const submitingNextPage = () => {
        nextPage();
    };

    const valueIni = {
        cheque: '',
        deposito_directo: '',
        traspaso: '',
        transferencia: '',
        BeneficiariosValues: [defaultState],
        codigo_fondo: tipoFondo.codigo,
        forma_abono: FormaAbonoC,
        entidad_bancaria: '',
        tipo_cuenta: '',
        numero_cuenta: '',
    };

    return (
        <Formik
            initialValues={valueIni}
            validationSchema={Yup.object().shape({
                codigo_fondo: Yup.string(),
                cheque: Yup.string()
                    .matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten números y 2 decimales')
                    .nullable()
                    .when(['deposito_directo', 'traspaso'], {
                        is: (deposito_directo, traspaso) => !deposito_directo && !traspaso,
                        then: Yup.string().required('Se requiere llenar este campo')
                    }),
                deposito_directo: Yup.string()
                    .matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten números y 2 decimales')
                    .nullable()
                    .when(['cheque', 'traspaso'], {
                        is: (cheque, traspaso) => !cheque && !traspaso,
                        then: Yup.string().required('Se requiere llenar este campo')
                    }),
                traspaso: Yup.string()
                    .matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten números y 2 decimales')
                    .nullable()
                    .when(['cheque', 'deposito_directo'], {
                        is: (cheque, deposito_directo) => !cheque && !deposito_directo,
                        then: Yup.string().required('Se requiere llenar este campo')
                    }),
                transferencia: Yup.string()
                    .matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten números y 2 decimales')
                    .nullable()
                    .when(['cheque', 'traspaso', 'deposito_directo'], (cheque, traspaso, deposito_directo, schema) => {
                        if (typeof cheque !== 'string' && typeof traspaso !== 'string' && typeof deposito_directo !== 'string')
                            return schema
                                .required('Se requiere llenar este campo');

                        return schema;
                    }),
                BeneficiariosValues: Yup.array().of(
                    Yup.object().shape({
                        nombresBeneficiarios: Yup.string()
                            .nullable()
                            .matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras')
                            .required('Se requiere llenar este campo'),
                        apellidosBeneficiarios: Yup.string()
                            .nullable()
                            .matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras')
                            .required('Se requiere llenar este campo'),
                        numero_identificacionBeneficiario: Yup.string()
                            .nullable()
                            .min(5, 'El dato ingresado es muy corto')
                            .max(13, 'El dato ingresado es muy largo')
                            .matches(/^[0-9A-Z-ÑÁÉÍÓÚ]+$/gm, 'Solo se admiten números y letras mayúsculas')
                            .required('Se requiere llenar este campo')
                            .test('validar identificación con tipo de identificacion', 'Cédula no válida', function (value) {
                                if (typeof (value) === 'string' && value.length === 10) {
                                var digits = value.split('').map(Number);
                                var provincialCode = digits[0] * 10 + digits[1];
                                    if (provincialCode >= 1 && (provincialCode <= 24 || provincialCode === 30)) {
                                        var checkerDigit = digits.pop();
                                        var calculatedDigit = digits.reduce((previousValue, currentValue, index) => {
                                            var isNine = (currentValue === 9) ? 1 : 0;
                                                return previousValue - ((currentValue * (2 - index % 2)) % 9) - isNine * 9;
                                        }, 1000) % 10;
                                        if (calculatedDigit !== checkerDigit) {
                                            return false;
                                        }
                                    } else {
                                        return false;
                                    }
                                }
                                    return true;
                            }),
                        fecha_expiracion_documentoBeneficiarios: Yup.date()
                            .nullable(),
                        nacionalidadBeneficiarios: Yup.string()
                            .nullable()
                            .required('Debe seleccionar una opcion!'),
                        otraNacionalidBeneficiario2: Yup.string()
                            .nullable(),
                        otraNacionalidBeneficiario3: Yup.string()
                            .nullable(),
                        otraNacionalidBeneficiario4: Yup.string()
                            .nullable(),
                    }),
                )
                .min(1, "Se requiere minumo 1 Beneficiario"),
                forma_abono: Yup.string()
                    .nullable()
                    .when('codigo_fondo', (codigo_fondo, schema) => {
                        if (codigo_fondo === '000038')
                            return schema
                                .required('Se requiere llenar este campo');

                        return schema;
                    }),
                entidad_bancaria: Yup.string()
                    .matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten números y 2 decimales')
                    .nullable()
                    .when('codigo_fondo', (codigo_fondo, schema) => {
                        if (codigo_fondo === '000038')
                            return schema
                                .required('Se requiere llenar este campo');

                        return schema;
                    }),
                tipo_cuenta: Yup.string()
                    .nullable()
                    .when('codigo_fondo', (codigo_fondo, schema) => {
                        if (codigo_fondo === '000038')
                            return schema
                                .required('Se requiere llenar este campo');

                        return schema;
                    }),
                numero_cuenta: Yup.string()
                    .matches(/^[0-9]+$/gm, 'Solo se admiten números')
                    .nullable()
                    .when('codigo_fondo', (codigo_fondo, schema) => {
                        if (codigo_fondo === '000038')
                            return schema
                                .required('Se requiere llenar este campo');

                        return schema;
                    }),
            }, [
                ['cheque', 'deposito_directo'],
                ['cheque', 'traspaso'],
                ['deposito_directo', 'traspaso']
            ])}

            onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
                try {
                //dispatch(postClientesCrear(values, step, cedulaCli));
                setStatus({ success: true });
                setSubmitting(false);
                submitingNextPage();
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

                            


                            {/* Card 1 */}
                            <Box mt={3}>
                                <Card>
                                    <CardHeader title="Montos de Inversión" />
                                    <Divider />
                                    <CardContent>
                                        {/* Elemento 1 */}
                                        <Grid container spacing={2} >
                                            <Grid item md={6} xs={12} >
                                                <Field
                                                    error={Boolean(touched.cheque && errors.cheque)}
                                                    helperText={touched.cheque && errors.cheque}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.cheque}
                                                    label="Cheque"
                                                    name="cheque"
                                                    id="cheque"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12} >
                                                <Field
                                                    error={Boolean(touched.deposito_directo && errors.deposito_directo)}
                                                    helperText={touched.deposito_directo && errors.deposito_directo}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.deposito_directo}
                                                    label="Deposito Directo"
                                                    name="deposito_directo"
                                                    id="deposito_directo"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12} >
                                                <Field
                                                    error={Boolean(touched.traspaso && errors.traspaso)}
                                                    helperText={touched.traspaso && errors.traspaso}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.traspaso}
                                                    label="Traspaso"
                                                    name="traspaso"
                                                    id="traspaso"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12} >
                                                <Field
                                                    error={Boolean(touched.transferencia && errors.transferencia)}
                                                    helperText={touched.transferencia && errors.transferencia}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.transferencia}
                                                    label="Transferencia"
                                                    name="transferencia"
                                                    id="transferencia"
                                                    component={renderTextField}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Box>

					

                            {/* Card 2 */}
                            <Box mt={3}>
                                <Card>
                                    <CardHeader title="Beneficiarios" />
                                    <Divider />
                                    <CardContent>
                                        <FieldArray
                                        validateOnChange={false}
                                        name="BeneficiariosValues"
                                        render={arrayHelpers => (
                                                <Fragment>
                                                    {Object.values(values.BeneficiariosValues).map((beneficiario, index) => {
                                                        const error = errors.BeneficiariosValues || false;
                                                        const touch = touched.BeneficiariosValues || false;
                                                        var validateError;
                                                        var validarTouch;
                                                        if (error) {
                                                            error.forEach(item => {
                                                                validateError = item;
                                                            });
                                                        }
                                                        if (touch) {
                                                            touch.forEach(item => {
                                                                validarTouch = item;
                                                            });
                                                        }
                                                            return (
                                                                <Box key={index}>
                                                                    <Grid container spacing={2}>
                                                                        <Grid item md={6} xs={12}>
                                                                            <Field
                                                                                error={Boolean(
                                                                                    touched &&
                                                                                    touched.BeneficiariosValues &&
                                                                                    touched.BeneficiariosValues[index] &&
                                                                                    touched.BeneficiariosValues[index].nombresBeneficiarios &&
                                                                                    errors &&
                                                                                    errors.BeneficiariosValues &&
                                                                                    errors.BeneficiariosValues[index] &&
                                                                                    errors.BeneficiariosValues[index].nombresBeneficiarios
                                                                                )}
                                                                                helperText={
                                                                                    touched &&
                                                                                    touched.BeneficiariosValues &&
                                                                                    touched.BeneficiariosValues[index] &&
                                                                                    touched.BeneficiariosValues[index].nombresBeneficiarios &&
                                                                                    errors &&
                                                                                    errors.BeneficiariosValues &&
                                                                                    errors.BeneficiariosValues[index] &&
                                                                                    errors.BeneficiariosValues[index].nombresBeneficiarios
                                                                                }
                                                                                onBlur={handleBlur}
                                                                                onChange={handleChange}
                                                                                value={beneficiario.nombresBeneficiarios}
                                                                                label="Nombres"
                                                                                name={`BeneficiariosValues.${index}.nombresBeneficiarios`}
                                                                                id={`BeneficiariosValues.${index}.nombresBeneficiarios`}
                                                                                component={renderTextField}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={6} xs={12}>
                                                                            <Field
                                                                                error={Boolean(
                                                                                    touched &&
                                                                                    touched.BeneficiariosValues &&
                                                                                    touched.BeneficiariosValues[index] &&
                                                                                    touched.BeneficiariosValues[index].apellidosBeneficiarios &&
                                                                                    errors &&
                                                                                    errors.BeneficiariosValues &&
                                                                                    errors.BeneficiariosValues[index] &&
                                                                                    errors.BeneficiariosValues[index].apellidosBeneficiarios
                                                                                )}
                                                                                helperText={
                                                                                    touched &&
                                                                                    touched.BeneficiariosValues &&
                                                                                    touched.BeneficiariosValues[index] &&
                                                                                    touched.BeneficiariosValues[index].apellidosBeneficiarios &&
                                                                                    errors &&
                                                                                    errors.BeneficiariosValues &&
                                                                                    errors.BeneficiariosValues[index] &&
                                                                                    errors.BeneficiariosValues[index].apellidosBeneficiarios
                                                                                }
                                                                                onBlur={handleBlur}
                                                                                onChange={handleChange}
                                                                                value={beneficiario.apellidosBeneficiarios}
                                                                                label="Apellidos"
                                                                                name={`BeneficiariosValues.${index}.apellidosBeneficiarios`}
                                                                                id={`BeneficiariosValues.${index}.apellidosBeneficiarios`}
                                                                                component={renderTextField}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={6} xs={12}>
                                                                            <Field
                                                                                error={Boolean(
                                                                                    touched &&
                                                                                    touched.BeneficiariosValues &&
                                                                                    touched.BeneficiariosValues[index] &&
                                                                                    touched.BeneficiariosValues[index].numero_identificacionBeneficiario &&
                                                                                    errors &&
                                                                                    errors.BeneficiariosValues &&
                                                                                    errors.BeneficiariosValues[index] &&
                                                                                    errors.BeneficiariosValues[index].numero_identificacionBeneficiario
                                                                                )}
                                                                                helperText={
                                                                                    touched &&
                                                                                    touched.BeneficiariosValues &&
                                                                                    touched.BeneficiariosValues[index] &&
                                                                                    touched.BeneficiariosValues[index].numero_identificacionBeneficiario &&
                                                                                    errors &&
                                                                                    errors.BeneficiariosValues &&
                                                                                    errors.BeneficiariosValues[index] &&
                                                                                    errors.BeneficiariosValues[index].numero_identificacionBeneficiario
                                                                                }
                                                                                onBlur={handleBlur}
                                                                                onChange={handleChange}
                                                                                value={beneficiario.numero_identificacionBeneficiarios}
                                                                                label="Numero de Identificación"
                                                                                name={`BeneficiariosValues.${index}.numero_identificacionBeneficiario`}
                                                                                id={`BeneficiariosValues.${index}.numero_identificacionBeneficiario`}
                                                                                component={renderTextField}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={6} xs={12} >
                                                                            <Field
                                                                                error={Boolean(
                                                                                    touched &&
                                                                                    touched.BeneficiariosValues &&
                                                                                    touched.BeneficiariosValues[index] &&
                                                                                    touched.BeneficiariosValues[index].fecha_expiracion_documentoBeneficiarios &&
                                                                                    errors &&
                                                                                    errors.BeneficiariosValues &&
                                                                                    errors.BeneficiariosValues[index] &&
                                                                                    errors.BeneficiariosValues[index].fecha_expiracion_documentoBeneficiarios
                                                                                )}
                                                                                helperText={
                                                                                    touched &&
                                                                                    touched.BeneficiariosValues &&
                                                                                    touched.BeneficiariosValues[index] &&
                                                                                    touched.BeneficiariosValues[index].fecha_expiracion_documentoBeneficiarios &&
                                                                                    errors &&
                                                                                    errors.BeneficiariosValues &&
                                                                                    errors.BeneficiariosValues[index] &&
                                                                                    errors.BeneficiariosValues[index].fecha_expiracion_documentoBeneficiarios
                                                                                }
                                                                                label="Fecha de Expiración"
                                                                                name={`BeneficiariosValues.${index}.fecha_expiracion_documentoBeneficiarios`}
                                                                                id={`BeneficiariosValues.${index}.fecha_expiracion_documentoBeneficiarios`}
                                                                                value={beneficiario.fecha_expiracion_documentoBeneficiarios}
                                                                                onChange={date => {
                                                                                setFieldValue(`BeneficiariosValues.${index}.fecha_expiracion_documentoBeneficiarios`, date);}}
                                                                                onBlur={handleBlur}
                                                                                component={renderDateTimePicker}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={6} xs={12} >
                                                                            <Field
                                                                                error={Boolean(
                                                                                    touched &&
                                                                                    touched.BeneficiariosValues &&
                                                                                    touched.BeneficiariosValues[index] &&
                                                                                    touched.BeneficiariosValues[index].nacionalidadBeneficiarios &&
                                                                                    errors &&
                                                                                    errors.BeneficiariosValues &&
                                                                                    errors.BeneficiariosValues[index] &&
                                                                                    errors.BeneficiariosValues[index].nacionalidadBeneficiarios
                                                                                )}
                                                                                helperText={
                                                                                    touched &&
                                                                                    touched.BeneficiariosValues &&
                                                                                    touched.BeneficiariosValues[index] &&
                                                                                    touched.BeneficiariosValues[index].nacionalidadBeneficiarios &&
                                                                                    errors &&
                                                                                    errors.BeneficiariosValues &&
                                                                                    errors.BeneficiariosValues[index] &&
                                                                                    errors.BeneficiariosValues[index].nacionalidadBeneficiarios
                                                                                }
                                                                                label="Nacionalidad"
                                                                                onBlur={handleBlur}
                                                                                name={`BeneficiariosValues.${index}.nacionalidadBeneficiarios`}
                                                                                id={`BeneficiariosValues.${index}.nacionalidadBeneficiarios`}
                                                                                value={beneficiario.nacionalidadBeneficiarios}
                                                                                onChange={handleChange}
                                                                                data={paises}
                                                                                component={renderSelectField}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={6} xs={12} className={classes.separateNacionalidad}>
                                                                            <Grid container spacing={2}>
                                                                                <Grid item md={6} xs={12} >
                                                                                </Grid>
                                                                                <Grid item md={6} xs={12} >
                                                                                    <Button className={classes.ButtonBlack} onClick={() => agregarNacionalidad(index)} fullWidth variant="contained" >
                                                                                        Agregar Nacionalidad
                                                                                    </Button>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    {
                                                                    showNacionalidad2 &&
                                                                    <Grid container spacing={2} >
                                                                        <Grid item md={6} xs={12} >
                                                                            <Field
                                                                                error={error && touch && validateError.otraNacionalidBeneficiario2 && validarTouch.otraNacionalidBeneficiario2}
                                                                                helperText={error && touch && validateError.otraNacionalidBeneficiario2 && validarTouch.otraNacionalidBeneficiario2}
                                                                                label="Nacionalidad"
                                                                                name={`BeneficiariosValues.${index}.otraNacionalidBeneficiario2`}
                                                                                id={`BeneficiariosValues.${index}.otraNacionalidBeneficiario2`}
                                                                                value={beneficiario.otraNacionalidBeneficiario2}
                                                                                onChange={handleChange}
                                                                                data={paises}
                                                                                component={renderSelectField}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={6} xs={12} className={classes.separateNacionalidad}>
                                                                            <Grid container spacing={2}>
                                                                                <Grid item md={6} xs={12} >
                                                                                </Grid>
                                                                                <Grid item md={6} xs={12} >
                                                                                    <Button className={classes.ButtonBlack} onClick={() => deleteNacionalidad2(setFieldValue)}   fullWidth variant="contained" >
                                                                                        Eliminar Nacionalidad
                                                                                    </Button>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    }
                                                                    {
                                                                    showNacionalidad3 &&
                                                                    <Grid container spacing={2} >
                                                                        <Grid item md={6} xs={12} >
                                                                            <Field
                                                                                error={error && touch && validateError.otraNacionalidBeneficiario3 && validarTouch.otraNacionalidBeneficiario3}
                                                                                helperText={error && touch && validateError.otraNacionalidBeneficiario3 && validarTouch.otraNacionalidBeneficiario3}
                                                                                label="Nacionalidad"
                                                                                name={`BeneficiariosValues.${index}.otraNacionalidBeneficiario3`}
                                                                                id={`BeneficiariosValues.${index}.otraNacionalidBeneficiario3`}
                                                                                value={beneficiario.otraNacionalidBeneficiario3}
                                                                                onChange={handleChange}
                                                                                data={paises}
                                                                                component={renderSelectField}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={6} xs={12} className={classes.separateNacionalidad}>
                                                                            <Grid container spacing={2}>
                                                                                <Grid item md={6} xs={12} >
                                                                                </Grid>
                                                                                <Grid item md={6} xs={12} >
                                                                                    <Button className={classes.ButtonBlack} onClick={() => deleteNacionalidad3(setFieldValue)}  fullWidth variant="contained" >
                                                                                        Eliminar Nacionalidad
                                                                                    </Button>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    }
                                                                    {
                                                                    showNacionalidad4 &&
                                                                    <Grid container spacing={2} >
                                                                        <Grid item md={6} xs={12} >
                                                                            <Field
                                                                                error={error && touch && validateError.otraNacionalidBeneficiario4 && validarTouch.otraNacionalidBeneficiario4}
                                                                                helperText={error && touch && validateError.otraNacionalidBeneficiario4 && validarTouch.otraNacionalidBeneficiario4}
                                                                                label="Nacionalidad"
                                                                                name={`BeneficiariosValues.${index}.otraNacionalidBeneficiario4`}
                                                                                id={`BeneficiariosValues.${index}.otraNacionalidBeneficiario4`}
                                                                                value={beneficiario.otraNacionalidBeneficiario4}
                                                                                onChange={handleChange}
                                                                                data={paises}
                                                                                component={renderSelectField}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={6} xs={12} className={classes.separateNacionalidad}>
                                                                            <Grid container spacing={2}>
                                                                                <Grid item md={6} xs={12} >
                                                                                </Grid>
                                                                                <Grid item md={6} xs={12} >
                                                                                    <Button className={classes.ButtonBlack} onClick={() => deleteNacionalidad4(setFieldValue)}  fullWidth variant="contained" >
                                                                                        Eliminar Nacionalidad
                                                                                    </Button>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    }
                                                                    {(cantBeneficiarios >= 1) ? (
                                                                        <Box mt={2} mb={2}>
                                                                            <Button style={{ background: 'black', color: 'white' }} size="small" type="button" onClick={() => handleOnRemove(arrayHelpers.remove, index)} variant="contained" >
                                                                                    Eliminar
                                                                            </Button>
                                                                        </Box>
                                                                    ) : ('')}
                                                                </Box>
                                                            );
                                                        })
                                                    }
                                                    <Box mt={2}>
                                                        <Button   style={{ background: 'black', color: 'white' }} size="large" type="button"  onClick={() => { handleOnAdd(arrayHelpers.push); }} variant="contained" >
                                                            Nuevo beneficiario
                                                        </Button>
                                                    </Box>
                                                </Fragment>
                                        )}/>
                                    </CardContent>
                                </Card>
                            </Box>

                            {/* card 3 solo para renta plus */}
                            {(tipoFondo.codigo === '000038') ? (
                                <Box mt={3}>
                                    <Card>
                                        <CardHeader title="Montos de Inversión" />
                                        <Divider />
                                        <CardContent>
                                            <Alert icon={false} severity="success" className={classes.SpaceMensaje1}>
                                                Solicito que los rendimientos que genere mi inversión sean acreditados atendiendo las siguientes especificaciones
                                            </Alert>
                                            <Grid container spacing={2} className={classes.separateButtonTP}>
                                                <Grid item md={12} xs={12} >
                                                    <Grid container spacing={2}>
                                                        <Grid item md={4} xs={12} >
                                                            <Button className={colorButtonMEN} onClick={() => handleChangeFormaAbono("MENSUAL", values) } id="MENSUAL" name="MENSUAL" fullWidth size="large" variant="contained" >
                                                                MENSUAL
                                                            </Button>
                                                        </Grid>
                                                        <Grid item md={4} xs={12} >
                                                            <Button className={colorButtonTRI} onClick={() => handleChangeFormaAbono("TRIMESTRAL", values) } id="TRIMESTRAL" name="TRIMESTRAL" fullWidth size="large" variant="contained" >
                                                                TRIMESTRAL
                                                            </Button>
                                                        </Grid>
                                                        <Grid item md={4} xs={12} >
                                                            <Button className={colorButtonSEM} onClick={() => handleChangeFormaAbono("SEMESTRAL", values) } id="SEMESTRAL" name="SEMESTRAL" fullWidth size="large" variant="contained" >
                                                                SEMESTRAL
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item md={4} xs={12} >
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
                                                <Grid item md={4} xs={12} >
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
                                                <Grid item md={4} xs={12} >
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
                                            </Grid>
                                            <Alert icon={false} severity="success" className={classes.SpaceMensaje2}>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor condimentum orci, at elementum erat. Donec vitae felis ante.
                                                Aliquam elementum cursus mauris et ullamcorper. Etiam posuere vel nisi ac facilisis. Vestibulum non metus erat. Interdum et malesuada
                                                fames ac ante ipsum primis in faucibus. Aliquam mattis sodales odio. Quisque eu ultrices lectus, at venenatis nibh. Pellentesque iaculis,
                                                nulla eu fringilla rutrum, purus dui imperdiet est, et vestibulum nisl enim ac justo. Suspendisse velit ligula, congue sit amet elit ac,
                                                venenatis egestas metus. Phasellus nisl nunc, feugiat at commodo pellentesque, auctor a arcu.

                                                Ut rutrum sodales vulputate. Vivamus purus purus, pellentesque et risus ac, laoreet venenatis orci. Donec eleifend dictum ante at hendrerit.
                                                Integer vehicula mi sed mattis blandit. Vivamus cursus facilisis diam vitae placerat. Curabitur vel imperdiet orci. Vestibulum nec
                                                pellentesque erat. Sed ullamcorper tempor risus at malesuada. Aenean tristique hendrerit sem eget aliquet. Donec scelerisque magna eu
                                                congue rutrum. Fusce pulvinar felis vitae felis egestas tempor. Donec et metus tristique enim consectetur convallis convallis in lacus.
                                            </Alert>
                                        </CardContent>
                                    </Card>
                                </Box>
                                ) : ('')}

                                {/* botones */}
                                <Box mt={3}>
                                    <Grid container>
                                        <Grid item md={12} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item md={6} xs={12} >
                                                </Grid>
                                                <Grid item md={6} xs={12} >
                                                    <Button  /*disabled={isSubmitting}*/ className={classes.ButtonBlack} /*</Grid>onClick={submitingNextPage}*/ fullWidth size="large" type="submit" variant="contained" >
                                                        Continuar<ArrowForwardIcon />
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


export default FormOCPStepOne;
