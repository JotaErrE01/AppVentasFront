import React from 'react';
import { TextField } from '@material-ui/core';

const renderTextField = ({
	id,
	name,
	label,
	error,
	helperText,
	onBlur,
	onChange,
	value,
	disabled,
	type = 'text',
	startAdornment,
	endAdornment,
	variant = 'outlined'
}) => {
	return (
		<TextField
			error={error}
			fullWidth
			helperText={helperText}
			label={label}
			name={name}
			id={id}
			type={type}
			onBlur={onBlur}
			onChange={onChange}
            InputLabelProps={{ shrink: true }}
			// defaultValue={value || ''}
			value={value != undefined ? value : ''}
			variant={variant}
			disabled={disabled}
			InputProps={{ startAdornment, endAdornment }}
		/>
	);
};

export default renderTextField;
