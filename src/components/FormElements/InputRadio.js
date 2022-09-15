import React from 'react';
import {
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
	Radio,
	RadioGroup,
} from '@material-ui/core';

const InputRadio = ({ id, data = [], helperText, error, onBlur, onChange, label, name, value }) => {
	return (
		<FormControl component="fieldset" error={error}>
			<FormLabel component="legend">{label}</FormLabel>
			<RadioGroup row id={id} name={name} aria-label={name} value={value} onChange={onChange} onBlur={onBlur}>
				{data.map((item) => (
					<FormControlLabel
						key={item.codigo}
						value={item.codigo}
						control={<Radio color="primary" />}
						inputProps={{ 'aria-label': item.contenido }}
						label={item.contenido}
					/>
				))}
			</RadioGroup>
			<FormHelperText error={error}>{helperText}</FormHelperText>
		</FormControl>
	);
};

export default InputRadio;
