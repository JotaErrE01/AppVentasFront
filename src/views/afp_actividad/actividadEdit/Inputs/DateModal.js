import 'date-fns';
import React, { useRef, useEffect, useState } from 'react';
import { Grid, Button, FormControl } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';


import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DateModal({ fechaCb, onClose, classes }) {
  // The first commit of Material-UI



  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(true);


  const handlePickDate = (date) => {

    //date.toISOString().split()[0]||date;
    const isValid = DateFnsUtils.prototype.isValid(date);
    isValid && fechaCb(date);
    setDate(date);
    setOpen(!open)
  }

  const handleClose = () => {
    setOpen(!open);
    // onClose()
  }


  return (

    <MuiPickersUtilsProvider
      utils={DateFnsUtils}>

      <KeyboardDatePicker
        fullWidth
        inputVariant="outlined"
        id="Dia de la reunión"
        label="Date picker dialog"
        format="dd/MM/yyyy "
        value={date}
        onChange={handlePickDate}
        KeyboardButtonProps={{ 'aria-label': 'seleccione una fecha', }}
      // open={}
      // style={{ visibility: 'hidden' }          
      />

    </MuiPickersUtilsProvider>

  );
}