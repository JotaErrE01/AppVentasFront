import React, { useEffect } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';



export default function ComboBox({ 
    id, setId, data, title 
 
}) {

    const [state, setState] = React.useState(data[0].codigo);

    useEffect(() => {
        setId(state);
    }, [])

    const handleChange = (event) => {
        setId(event.target.value)
        setState({ ...state, id: event.target.value });
    };


    return (
        <FormControl fullWidth variant="filled" >
            <InputLabel id="demo-simple-select-label">{title}</InputLabel>
            <Select native value={id} onChange={handleChange}>
                { data.map(item => <option key={item.id} value={item.codigo}>{item.contenido}</option>) }
            </Select>
        </FormControl>
    );
}
