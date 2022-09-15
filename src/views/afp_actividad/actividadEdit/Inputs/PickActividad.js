import React, {useEffect} from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';



export default function NativeSelects({
  actividadId,
  actividades,
  actividadCb,

}) {

  // const [state, setState] = React.useState(actividades[0].id);

  

  // useEffect(() => {
  //   actividadCb(state);

  // }, [])

  const handleChange = (event) => {
    const payload = actividades;
    
    actividadCb(event.target.value)
    // setState({
    //   ...state,
    //   id: event.target.value,
    // });
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
    >
      {/* <InputLabel htmlFor="actividad-native-simple">actividad</InputLabel> */}
      <Select
        native
        value={actividadId}
        onChange={handleChange}
        inputProps={{
          name: 'actividad',
          id: 'actividad-native-simple',
        }}


      >
        <option aria-label="None" value={1} >Seleccione</option>
        {

          actividades.map(item =>
            <option key={item.id} value={item.id}>{item.contenido}</option>
          )
        }
      </Select>
    </FormControl>


  );
}
