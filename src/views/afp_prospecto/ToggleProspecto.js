import { Button, ButtonGroup } from '@material-ui/core'
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { Contacts, DetailsRounded, FilterListRounded, ImportContactsRounded } from '@material-ui/icons';
import { Filter } from 'react-feather';

const useStyles = makeStyles((theme) => ({
    root: {
        // marginTop:theme.spacing(1),
        marginBottom: theme.spacing(3)

    },
}));

const ToggleProspecto = () => {

    const classes = useStyles();
    const history = useHistory()


    return (
        <ButtonGroup
            className={classes.root}
            size="large"
            color="primary"
            aria-label="outlined primary button group">
            <Button variant="contained" endIcon={<Contacts/>}>Prospectos</Button>
            <Button onClick={()=>history.push('/afp/intencion')} endIcon={<Filter/>}>LEADS</Button>
        </ButtonGroup>
    )
}

export default ToggleProspecto
