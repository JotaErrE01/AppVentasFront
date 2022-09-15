import React, { useEffect } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import JSONTree from 'react-json-tree';



export default function ComboCatDistribucion({ 
    id, setId, data, title 
 
}) {

    const [state, setState] = React.useState(data[0].id);

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
                { data.map(item => <option key={item.id} value={item.id}>{item.title}</option>) }
            </Select>
        </FormControl>
    );
}
