/* eslint-disable no-use-before-define */
import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';



export default function ComboBox({
  current, 
  setCurrent, 
  options,
  label
}) {
  const [value, setValue] = useState(current);
  const [inputValue, setInputValue] = useState('');

  const [blur, setBlur] = useState(false);

  return (

    <>


      <Autocomplete

        inputValue={inputValue}

        onChange={(event, newValue) => {
          newValue && newValue.id ? setValue(newValue.id) : setValue(null);
          newValue && newValue.id ? setCurrent(newValue.id) : setCurrent(null);

        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={options}
        getOptionLabel={(option) => `${option.nombre_cliente} ${option.apellido_cliente}`}
        style={{ width: '100%' }}
        renderInput={(params) =>
          <TextField {...params}

            label={label}
            variant="outlined"
            onBlur={()=>setBlur(true)}
            error={(!value && blur) && true}
            helperText={(!value && blur) && 'Este campo es obligatorio'}
          />}


      />


    </>
  );
}



