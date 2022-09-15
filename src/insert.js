const payload = {
    "codigo_fondo": "string",
    "codigo_cliente": "string",
    "primer_apellido": "string",
    "segundo_apellido": "string",
    "primer_nombre": "string",
    "segundo_nombre": "string",
    "fecha_nacimiento": "string",
    "sexo": "string",
    "nacionalidad": "string",
    "estado_civil": "string",
    "actividad_economica": "string",
    "provincia": "string",
    "canton": "string",
    "parroquia": "string",
    "recinto": "string",
    "codigo_regional": "string",
    "ciudadela": "string",
    "etapa": "string",
    "numero_casilla": "string",
    "calle_principal": "string",
    "numero_principal": "string",
    "calle_interseccion_1": "string",
    "calle_interseccion_2": "string",
    "manzana": "string",
    "solar_villa": "string",
    "nombre_edificio": "string",
    "piso": "string",
    "numero_departamento": "string",
    "referencia_adicional": "string",
    "telefono_principal": "string",
    "telefono_secundario": "string",
    "departamento_laboral": "string",
    "extension_laboral": "string",
    "email": "string",
    "nivel_preparacion": "string",
    "profesion": "string",
    "situacion_laboral": "string",
    "cargo": "string",
    "monto_ingreso": 0,
    "correspondencia": "string",
    "fecha_ingreso": "string",
    "marca_sindicado_consep": "string",
    "fecha_sindicado_consep": "string",
    "numero_identificacion": "string",
    "tipo_identificacion": "string",
    "proveed_celular1": "string",
    "celular1": "string",
    "pais_nacimiento": "string",
    "nacionalidad2": "string",
    "nacionalidad3": "string",
    "fecha_expira_ci_pas": "string",
    "es_persona_estadounidense": "string",
    "numero_contribuyente_us": "string",
    "es_residente_otro_pais": "string",
    "adjunta_formulario_ac": "string",
    "representante_legal_apoderado": "string",
    "representante_legal_cedula_pas": "string",
    "pais_residencia_local": "string",
    "_Afi_Empresa_cliente": [
      {
        "numero_ruc": "string",
        "nombre_empresa": "string",
        "telefono_empresa": "string",
        "provincia": "string",
        "canton": "string",
        "parroquia": "string",
        "ciudadela": "string",
        "etapa": "string",
        "numero_casilla": "string",
        "calle_principal": "string",
        "numero_principal": "string",
        "calle_interseccion_1": "string",
        "manzana": "string",
        "solar_villa": "string",
        "nombre_edificio": "string",
        "piso": "string",
        "numero_departamento": "string",
        "referencia_adicional": "string",
        "email": "string",
        "extension_laboral": "string"
      }
    ],
    "_Afi_debito_automatico": {
      "autorizacion_debito": "string",
      "codigo_banco": "string",
      "numero_cuenta": "string",
      "fecha_inicio_debito": "string",
      "periodo_caducidad": "string",
      "tipo_ident_titular": "string",
      "ced_titular_cta_tarj": "string",
      "emisor_tarjeta": "string",
      "tipo_cuenta": "string",
      "marca_fecha_ini_deb": "string"
    },
    "_Afi_beneficiario_adicional": [
      {
        "codigo_fondo": "string",
        "codigo_cliente": "string",
        "cedula_beneficiario": "string",
        "nombre_beneficiario": "string",
        "estado_beneficiario": "string"
      }
    ],
    "_Afi_beneficiario_seguro_vida": [
      {
        "cedula_beneficiario": "string",
        "nombre_beneficiario": "string",
        "apellido_beneficiario": "string",
        "fecha_nacimiento": "string",
        "cod_parentesco": "string",
        "email": "string",
        "telefono": "string"
      }
    ],
    "_Afi_aporte_cliente": {
      "fecha_inicio_aporte": "string",
      "monto_aporte": 0,
      "codigo_sistema_aporte": "string"
    }
};


const response = {
    "estado": 1, // APROBADO ERROR
    "folio": "string",
    "secuencia": "string",
    "listadoErrores": [
        {
        "codigoError": "string",
        "descripcion": "string"
        }
    ]
};