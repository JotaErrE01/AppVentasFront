import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    tipo_documento: Yup.string()
        .required('Se debe elegir una opción'),
    numero_identificacion: Yup.string()
        .required('Se requiere llenar este campo')
        .when('tipo_documento', (tipo_documento, schema) => {
            if (tipo_documento === "C") {
                return schema
                    .min(10, 'El dato ingresado es muy corto')
                    .max(10, 'El dato ingresado es muy largo')
                    .matches(/^[0-9]+$/gm, 'Solo se admiten números')
                    .required('Se requiere llenar este campo');
            } else if (tipo_documento === "P") {
                return schema
                    .min(5, 'El dato ingresado es muy corto')
                    .max(13, 'El dato ingresado es muy largo')
                    .matches(/^[0-9A-Z-ÑÁÉÍÓÚ]+$/gm, 'Solo se admiten números y letras mayúsculas')
                    .required('Se requiere llenar este campo');
            }
                return schema;
        })
        .test('validar identificación con tipo de identificacion', 'Cédula no válida', function (value) {
            let tipo_documento = this.parent.tipo_documento;
            if (typeof (value) === 'string' && value.length === 10 && tipo_documento === "CI") {
            let digits = value.split('').map(Number);
            let provincialCode = digits[0] * 10 + digits[1];
                if (provincialCode >= 1 && (provincialCode <= 24 || provincialCode === 30)) {
                    let checkerDigit = digits.pop();
                    let calculatedDigit = digits.reduce((previousValue, currentValue, index) => {
                        let isNine = (currentValue === 9) ? 1 : 0;
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
    fecha_expiracion_documento: Yup.date(),
    nombre_cliente: Yup.string()
        .required('Se requiere llenar este campo')
        .matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras'),
    apellido_cliente: Yup.string()
        .required('Se requiere llenar este campo')
        .matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras'),
    sexo_cliente: Yup.string()
        .required('Se debe elegir una opción'),
    fecha_expiracion_documento: Yup.date(),
    pais_ubicacion_cliente: Yup.string()
        .required('Se debe elegir una opción'),
    grado_instruccion_cliente: Yup.string()
        .required('Se debe elegir una opción'),
    titulo_obtenido_cliente: Yup.string()
        .required('Se requiere llenar este campo'),
    nacionalidad_cliente: Yup.string()
        .required('Debe rellenar este campo!'),
    estado_civil_cliente: Yup.string()
        .required('Debe marcar una opcion!'),
    numero_identificacion_conyugue: Yup.string()
        .when('estado_civil_cliente', (estado_civil_cliente, schema) => {
            if (estado_civil_cliente === "C") {
                return schema
                    .min(5, 'El dato ingresado es muy corto')
                    .max(13, 'El dato ingresado es muy largo')
                    .matches(/^[0-9A-Z-ÑÁÉÍÓÚ]+$/gm, 'Solo se admiten números y letras mayúsculas')
                    .required('Se requiere llenar este campo');
            }
                return schema;
        }),
    nombre_apellido_conyugue: Yup.string()
        .when('estado_civil_cliente', (estado_civil_cliente, schema) => {
            if (estado_civil_cliente === "C") {
                return schema
                    .required('Se requiere llenar este campo');
            }
                return schema;
        }),
    numero_identificacion_representante_legal: Yup.string()
        .min(5, 'El dato ingresado es muy corto')
        .max(13, 'El dato ingresado es muy largo')
        .matches(/^[0-9A-Z-ÑÁÉÍÓÚ]+$/gm, 'Solo se admiten números y letras mayúsculas'),
        /* .required('Se requiere llenar este campo'), */
    nombre_apellido_representante_legal: Yup.string()
        /* .required('Se requiere llenar este campo') */,
    fecha_jubilacion: Yup.date(),


    telefono_cliente: Yup.string()
        .required('Se requiere llenar este campo')
        .matches(/^[0-9]+$/gm, 'Solo se admiten números'),
    celular_cliente: Yup.string()
        /* .required('Se requiere llenar este campo') */
        .matches(/^[0-9]+$/gm, 'Solo se admiten números'),
    correo_cliente: Yup.string()
        .email('Se requiere un correo válido')
        .required('Se requiere llenar este campo'),
    provincia_cliente: Yup.string()
        .required('Se debe elegir una opción'),
    canton_cliente: Yup.string()
        .required('Se debe elegir una opción'),
    parroquia_cliente: Yup.string()
        .required('Se requiere llenar este campo'),
    recinto_cliente: Yup.string()
        /* .required('Se requiere llenar este campo') */,
    calle_principal_domicilio: Yup.string()
        /* .required('Se requiere llenar este campo') */
        .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales'),
    numeracion_domicilio: Yup.string()
        .when('calle_principal_domicilio', (calle_principal_domicilio, schema) => {
            if (calle_principal_domicilio !== '' || calle_principal_domicilio !== 'NULL' || calle_principal_domicilio !== 'null' || calle_principal_domicilio !== 'false') {
                return schema
                    .required('Se requiere llenar este campo')
                    .matches(/^[0-9Nn#°.\- ]+$/gm, 'Solo se admiten las letras (N n), números y # ° . - como caracteres especiales');
            }
                return schema;
            }),
    interseccion_domicilio: Yup.string()
        .when('calle_principal_domicilio', (calle_principal_domicilio, schema) => {
            if (calle_principal_domicilio !== '' || calle_principal_domicilio !== 'NULL' || calle_principal_domicilio !== 'null' || calle_principal_domicilio !== 'false') {
                return schema
                    .required('Se requiere llenar este campo')
                    .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales');
            }
                return schema;
            }),
    codigo_postal_domicilio: Yup.string()
        /* .required('Se requiere llenar este campo') */
        .matches(/^[0-9\-]+$/gm, 'Solo se admiten números y - como caracteres especiales'),
    ciudadela_cooperativa_sector_domicilio: Yup.string()
        /* .required('Se requiere llenar este campo') */
        .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales'),
    etapa_domicilio: Yup.string()
        /* .required('Se requiere llenar este campo') */
        .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales'),
    manzana_domicilio: Yup.string()
        /* .required('Se requiere llenar este campo') */
        .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales'),
    solar_domicilio: Yup.string()
        /* .required('Se requiere llenar este campo') */
        .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales'),
    referencia_domicilio: Yup.string()
        /* .required('Se requiere llenar este campo') */
        .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , + - como caracteres especiales'),
    edificio_domicilio: Yup.string()
        .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales'),
    piso_edificio_domicilio: Yup.string()
        .when('edificio_domicilio', (edificio_domicilio, schema) => {
            if (edificio_domicilio !== '' || edificio_domicilio !== 'NULL' || edificio_domicilio !== 'null' || edificio_domicilio !== 'false')
                return schema
                    .required('Se requiere llenar este campo')
                    .matches(/^[0-9Nn#°.\- ]+$/gm, 'Solo se admiten las letras (N n), números y # ° . - como caracteres especiales');
                return schema;
            }),
    numero_departamento_edificio_domicilio: Yup.string()
        .when('edificio_domicilio', (edificio_domicilio, schema) => {
            if (edificio_domicilio !== '' || edificio_domicilio !== 'NULL' || edificio_domicilio !== 'null' || edificio_domicilio !== 'false')
                return schema
                    .required('Se requiere llenar este campo')
                    .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm, 'Solo se admiten letras, números y # ° . - como caracteres especiales');
                return schema;
        }),
    actividad_economica: Yup.string()
        .required('Se debe elegir una opción'),
    ruc_actividad_economica_cliente: Yup.string()
        .when('actividad_economica', (actividad_economica, schema) => {
            if (actividad_economica !== 'S01')
                return schema
                    .matches(/^[0-9\-]+$/gm, 'Solo se admiten números y - como caracteres especiales')
                    .required('Se requiere llenar este campo');
                return schema;
            }),
    razon_social_actividad_economica_cliente: Yup.string()
        .when('actividad_economica', (actividad_economica, schema) => {
            if (actividad_economica !== 'S01')
                return schema
                    .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales')
                    .required('Se requiere llenar este campo');
                return schema;
            }),
    cargo_actividad_actividad_economica_cliente: Yup.string()
        .when('actividad_economica', (actividad_economica, schema) => {
            if (actividad_economica !== 'S01')
                return schema
                    .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales')
                    .required('Se requiere llenar este campo');
                return schema;
            }),
    /* dpto_laboral_actividad_economica_cliente: Yup.string()
        .when('actividad_economica', (actividad_economica, schema) => {
            if (actividad_economica != 'S01')
                return schema
                .required('Se requiere llenar este campo')
                    .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales')
                    .required('Se requiere llenar este campo');
                return schema;
            }), */
    /* telefono_actividad_economica_cliente: Yup.string()
        .when('actividad_economica', (actividad_economica, schema) => {
            if (actividad_economica != 'S01')
                return schema
                    .matches(/^[0-9+\-]+$/gm, 'Solo se admiten números y + - como caracteres especiales')
                    .required('Se requiere llenar este campo');
                return schema;
            }), */
    /* ext_telefono_actividad_economica_cliente: Yup.string()
        .when('actividad_economica', (actividad_economica, schema) => {
            if (actividad_economica != 'S01')
                return schema
                    .matches(/^[0-9+\-]+$/gm, 'Solo se admiten números y + - como caracteres especiales')
                    .required('Se requiere llenar este campo');
                return schema;
            }), */
    /* correo_actividad_economica_cliente: Yup.string()
        .when('actividad_economica', (actividad_economica, schema) => {
            if (actividad_economica !== 'S01')
                return schema
                    .email('Ingrese un formato de correo valido!')
                    .required('Se requiere llenar este campo');
                return schema;
            }), */
    provincia_actividad_economica_cliente: Yup.string()
        .when('actividad_economica', (actividad_economica, schema) => {
            if (actividad_economica !== 'S01')
                return schema
                .required('Se debe elegir una opción');
                return schema;
            }),
    canton_actividad_economica_cliente: Yup.string()
        .when('actividad_economica', (actividad_economica, schema) => {
            if (actividad_economica !== 'S01')
                return schema
                    .matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras')
                    .required('Se requiere llenar este campo');
                return schema;
            }),
    parroquia_actividad_economica_cliente: Yup.string()
        .when('actividad_economica', (actividad_economica, schema) => {
            if (actividad_economica !== 'S01')
                return schema
                    .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales')
                    .required('Se requiere llenar este campo');
                return schema;
        }),
    edificio_domicilio_actividad: Yup.string()
        .required('Se requiere llenar este campo')
        .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm, 'Solo se admiten letras, números y # ° . , - como caracteres especiales'),
    piso_edificio_domicilio_actividad: Yup.string()
        .required('Se requiere llenar este campo')
        .matches(/^[0-9Nn#°.\- ]+$/gm, 'Solo se admiten las letras (N n), números y # ° . - como caracteres especiales'),
    numero_departamento_edificio_domicilio_actividad: Yup.string()
        .required('Se requiere llenar este campo')
        .matches(/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm, 'Solo se admiten letras, números y # ° . - como caracteres especiales'),
    codigo_postal_edificio_domicilio_actividad: Yup.string()
        .required('Se requiere llenar este campo')
        .matches(/^[0-9\-]+$/gm, 'Solo se admiten números y - como caracteres especiales'),
});

export default validationSchema;