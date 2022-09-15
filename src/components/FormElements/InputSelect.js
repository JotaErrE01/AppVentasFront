import React from 'react';
import { TextField } from '@material-ui/core';

const renderSelectField = ({
    id,
    data = [],
    helperText,
    error,
    onBlur,
    onChange,
    label,
    name,
    value,
    disabled = false,
}) => {
    return (
        <TextField
                select
                disabled={disabled}
                variant="outlined"
                error={error}
                fullWidth
                helperText={helperText}
                label={label}
                onBlur={onBlur}
                onChange={onChange}
                // native
                // defaultValue={value || ''}
                InputLabelProps={{ shrink: true }}
                SelectProps={{ native: true }}
                id={id}
                name={name}
                value={value || ''}
                >
                <option />
                {data.map((option) => (
                    <option key={option.codigo} value={option.codigo}>
                        {option.contenido || option.tipo_parentesco}
                    </option>
                ))}
        </TextField>
    );
};

export default renderSelectField;
