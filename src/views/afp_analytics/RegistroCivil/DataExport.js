import React from 'react';
import xlsx from 'json-as-xlsx'
import { Button, makeStyles } from '@material-ui/core';

import JSONTree from 'react-json-tree';
import { RiFileExcel2Line } from 'react-icons/ri';

const DataExport = ({ data, fileName }) => {

  const classes = useStyles();


  const content = [
    {
      sheet: "consulta_registro_civil",
      columns: [
        { label: "id", value: "id" }, 
        { label: "creado_en", value: "created_at" },
        { label: "api", value: "api_endpoint" }, 
        { label: "cedula", value: (row) => (row.numero_identificacion ? row.numero_identificacion || "" : "") }, 
        { label: "creado_por", value: "created_by" }, 
        { label: "usuario", value: "usuario" }, 
        { label: "nombre", value: "name" }, 
        { label: "descripcion_localidad", value: "descripcion_localidad" }, 
        { label: "descripcion_cargo", value: "descripcion_cargo" }, 
        { label: "nombre_jefe", value: "nombre_jefe" }, 
        { label: "numero_identificacion", value: "numero_identificacion" }, 

      ],
      content: data,
    },
  ]

  const  settings = {
    fileName: fileName, // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
  }


  return (
  
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        endIcon={<RiFileExcel2Line/>}
        onClick={() => xlsx(content, settings)}
      >
        Descargar
      </Button>
      
  )
}

export default DataExport;


const useStyles = makeStyles((theme) => ({
  button: {
  },
}));
