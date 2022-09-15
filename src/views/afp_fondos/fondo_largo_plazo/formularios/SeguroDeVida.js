
import React, { useState } from "react";
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
// import parentesco from 'src/views/JSON_CATALOGOS/PARENTESCO';

import { getCatalogoParentesco } from 'src/slices/catalogos';

const defaultState = {
  nombresSeguroVida: "",
  apellidosSeguroVida: "",
  emailSeguroVida: "",
  parentescoSeguroVida: ""
};

function Row({ onChange, onRemove, nombresSeguroVida, apellidosSeguroVida, emailSeguroVida, parentescoSeguroVida }) {   
    
	let { parentescos = [] } = useSelector(
    (state) => state.catalogo
    );

  useEffect(() => {
    dispatch(getCatalogoParentesco());
  }, [dispatch])

  return (
    <div>
      <Grid
          container
          spacing={2}
        >
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              // error={Boolean(touched.nombresSeguroVida && errors.nombresSeguroVida)}
              fullWidth
              // helperText={touched.nombresSeguroVida && errors.nombresSeguroVida}
              label="Nombres"
              name="nombresSeguroVida"
              onChange={e => onChange("nombresSeguroVida", e.target.value)}
              value={nombresSeguroVida}
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              //error={Boolean(touched.apellidosSeguroVida && errors.apellidosSeguroVida)}
              fullWidth
              // helperText={touched.apellidosSeguroVida && errors.apellidosSeguroVida}
              label="Apellidos "
              name="apellidosSeguroVida"
              //onBlur={handleBlur}
              onChange={e => onChange("apellidosSeguroVida", e.target.value)}
              value={apellidosSeguroVida}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Box mt={2}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            md={6}
            xs={12}
          >
          <TextField
            name="parentescoSeguroVida"
            //error={Boolean(touched.parentescoSeguroVida && errors.parentescoSeguroVida)}
            fullWidth
            // helperText={touched.parentescoSeguroVida && errors.parentescoSeguroVida}
            select
            label="Parentesco"
            value={parentescoSeguroVida}
            onChange={e => onChange("parentescoSeguroVida", e.target.value)}
            variant="outlined"
          >
            {parentescos.map((option) => (
              <MenuItem key={option.codigo} value={option.codigo}>
                {option.contenido}
              </MenuItem>
            ))}
          </TextField>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              //error={Boolean(touched.emailSeguroVida && errors.emailSeguroVida)}
              fullWidth
              //helperText={touched.emailSeguroVida && errors.emailSeguroVida}
              label="Email"
              name="emailSeguroVida"
              // onBlur={handleBlur}
              onChange={e => onChange("emailSeguroVida", e.target.value)}
              value={emailSeguroVida}
              variant="outlined"
            />
          </Grid>
        </Grid>
        </Box>
         <Box m={2}>
            <Button
              style={{background:'black', color:'white'}}
              size="small"
              type="button"
              onClick={onRemove}
              variant="contained"
            >
              Eliminar
            </Button>
          </Box>
    </div>
  );
}

export default function App() {
  const [rows, setRows] = useState([defaultState]);
  const { enqueueSnackbar } = useSnackbar();
  const [cantNs, setCantNs] = useState(0);
  const handleOnChange = (index, name, value) => {
    const copyRows = [...rows];
    copyRows[index] = {
      ...copyRows[index],
      [name]: value
    };
    setRows(copyRows);
  };

  const handleOnAdd = () => {
    if(cantNs < 3) {
    setRows(rows.concat(defaultState));
    setCantNs(cantNs + 1);
    }else{
        enqueueSnackbar('No puede agregar más de 4 beneficiarios', {
          variant: 'error'
      });
    }
  };

  const handleOnRemove = index => {
    const copyRows = [...rows];
    copyRows.splice(index, 1);
    setCantNs(cantNs - 1);
    setRows(copyRows);
  };

  return (
    <div className="App">
      {rows.map((row, index) => (
        <Row
          {...row}
          onChange={(name, value) => handleOnChange(index, name, value)}
          onRemove={() => handleOnRemove(index)}
          key={index}
        />
      ))}
         <Box mt={2}>
                  <Button
                    style={{background:'black', color:'white'}}
                    size="large"
                    type="button"
                    onClick={handleOnAdd}
                    variant="contained"
                  >
                    Nuevo beneficiario
                  </Button>
          </Box>
    </div>
  );
}
