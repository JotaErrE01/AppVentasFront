import React, { useState } from 'react';
import { Button, makeStyles, withStyles } from '@material-ui/core';
import { Paper, TextField } from '@material-ui/core';
import { PermContactCalendar, SearchIcon, MenuIcon } from '@material-ui/icons';
import { Typography, IconButton, Grid, Divider } from '@material-ui/core';
import { format } from 'date-fns';
import DateFnsUtils from "@date-io/date-fns";
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing(2)
  },


  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },



  textField: {
    width: '100%',
    marginRight: theme.spacing(1),

  },




}));


const castDate = (fecha, hora) => {
  const _fecha = new Date(fecha);
  const _hora = new Date(hora);
  const datetime = new Date(
    DateFnsUtils.prototype.getYearText(_fecha),
    DateFnsUtils.prototype.getMonth(_fecha),
    DateFnsUtils.prototype.getDayText(_fecha),
    DateFnsUtils.prototype.getHourText(_hora),
    DateFnsUtils.prototype.getMinuteText(_hora),
    0, 0); // 1 Jan 2011, 00:00:00
  return datetime;
}

const castDateToText = (date) => {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const payload = date.toLocaleDateString('es-ES', options)
  return payload;
}

const validationSchema = Yup.object().shape({
  fecha: Yup.date().typeError('Debes ingersar una fecha valida'),
  hora: Yup.date().typeError('Debes ingersar una hora válida'),
});

const initialValues = {
  "fecha": null,
  "hora": null
}

export default function AgendarModule({
  guardarActividad
}) {
  const classes = useStyles();


  const [step, setStep] = useState(0)


  const handleSave = (values, { setErrors, setStatus, setSubmitting }) => {
    const { fecha, hora } = values

    const dateTime = castDate(fecha, hora);
    const dateText = castDateToText(dateTime);

    const payload = {
      codigo: "video",
      datetime: dateTime,
      datetext: dateText
    }
    guardarActividad(payload, ()=>setSubmitting(false));


  }



  return (

    <>

      {
        step == 0 &&
        <Paper component="form" className={classes.root} >
          <Typography variant="body1" className={classes.input}>
            AGENDAR VIDEO LLAMADA
        </Typography>
          <Divider className={classes.divider} orientation="vertical" />
          <GreenButton
            aria-label="colgar"
            onClick={() => setStep(1)}
          >
            <PermContactCalendar />
          </GreenButton>
        </Paper>
      }
      {
        step == 1 &&

        <>



          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSave}
            validationSchema={validationSchema} >
            {
              ({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) =>
                <form onSubmit={handleSubmit} className={classes.view} >

                  <Grid container className={classes.root} spacing={2}>
                    <Grid item xs={12} md={12}>
                      <Typography variant="h3">
                        Agendar video llamada
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          name="fecha"
                          fullWidth
                          error={Boolean(touched.fecha && errors.fecha)}
                          helperText={
                            touched.fecha && errors.fecha ? errors.fecha : ''
                          }
                          placeholder="dd/MM/yyyy"
                          id="date-picker-dialog"
                          label="Ingrese el día"
                          inputVariant="outlined"
                          format="dd/MM/yyyy"
                          value={values.fecha}
                          onBlur={handleBlur}
                          onChange={
                            value => setFieldValue("fecha", value)
                          }

                          KeyboardButtonProps={{ "aria-label": "cambiar fecha" }}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                          name="hora"
                          fullWidth
                          error={Boolean(touched.hora && errors.hora)}
                          helperText={
                            touched.hora && errors.hora ? errors.hora : ''
                          }
                          placeholder="HH:mm"

                          id="date-picker-dialog"
                          label="Ingrese la hora"
                          inputVariant="outlined"
                          format="HH:mm"
                          value={values.hora}
                          onBlur={handleBlur}
                          onChange={value => setFieldValue("hora", value)}
                          KeyboardButtonProps={{ "aria-label": "cambiar hora" }}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button size="large" 
                        onClick={()=>setStep(0)}
                        disabled={isSubmitting}
                        variant="outlined"
                        style={{ width: "100%" }}>
                        Cerrar
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button size="large" color="secondary" variant="contained"
                        disabled={isSubmitting}
                        type="submit"
                        style={{ width: "100%" }}>
                        {isSubmitting ? 'Guardando' : 'Guardar'}
                      </Button>
                    </Grid>
                   

                  </Grid>
                </form>

            }
          </Formik>

        </>

      }










    </>
  );
}





const GreenButton = withStyles((theme) => ({
  root: {
    display: 'flex',
    margin: '.3em .3em',
    color: "#ffffff",
    backgroundColor: "#147efb",
    '&:hover': {
      backgroundColor: "#1162bf"
    },
    "& svg": {
      height: '.9em',
      width: '.9em'
    },
    "&:disabled": {

    }
  },

}))(IconButton);

