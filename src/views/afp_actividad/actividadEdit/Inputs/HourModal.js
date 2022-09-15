import 'date-fns';
import React, { useRef, useEffect, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DateModal({ datetimeCb, classes }) {
    // The first commit of Material-UI

    const [hour, setHour] = useState(new Date);




    const pickHour = (hour) => {
        const payload = hour.toISOString().split()[0];
        setHour(hour);
        datetimeCb(payload);
        
    }


    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
                <KeyboardTimePicker
                    fullWidth
                    className={classes.formControl}
                    inputVariant="outlined"
                    id="time-picker"
                    label="Hora de la reunión"
                    value={hour}
                    onChange={pickHour}
                    KeyboardButtonProps={{
                        'aria-label': 'change time',
                    }}
                    style={{ visibility: '' }}
                />


            </Grid>
        </MuiPickersUtilsProvider>
    );
}