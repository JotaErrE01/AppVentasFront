import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { TextField } from '@material-ui/core';

const renderDateTimePicker = ({ id, name, label, error, helperText, onBlur, disabled, onChange, value, fullWidth, variant, size }) => {
	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<KeyboardDatePicker
				inputVariant={variant}
				fullWidth={fullWidth}
				id="date-picker-dialog"
				label="Date picker dialog"
				value={value}
				format="dd/MM/yyyy"
				error={error}
				name={name}
				label={label}
				helperText={helperText}
				onChange={onChange}
				disabled={disabled}
				KeyboardButtonProps={{
					'aria-label': 'change date'
				}}
				size={size}
			/>
		</MuiPickersUtilsProvider>
	);
};

export default renderDateTimePicker;
