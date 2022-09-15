import React, { useState } from 'react';
import _ from 'lodash';
import { Typography, TextField, FormControl, ListItem, List, Chip, Box, makeStyles } from '@material-ui/core';

const FilterUsers = ({
    options,
    participants,
    setParticipants
}) => {


    const [open, setOpen] = useState(false);
    const [searchable, setSearchable] = useState(options);



    const classes = useStyles();


    const addUser = (payload) => {
        
        const _users = [...participants];
        const found = _.find(_users, (item) => {
            return item.id == payload.id;
        });
        
        if (!found) _users.push(payload);
        setParticipants([..._users]);
    };

    const removeUser = (payload) => {
        const _users = [...participants];
        const found = _.findIndex(_users, (item) => {
            return item.id == payload.id;
        });
        if (found > -1) _users.splice(found, 1);
        setParticipants([..._users]);
    };

    const filterUsers = payload => {
        const _avaiableUsers = [];
        options.forEach(element => {
            const name = element.name.toLocaleLowerCase();
            const includes = name.includes(payload.toLocaleLowerCase());
            
            includes && _avaiableUsers.push(element);
        });
        setSearchable([..._avaiableUsers]);
    };


    const handleAdd = (payload) => {
        addUser(payload);
        setOpen(false);
    }





    return (
        <>


            <FormControl fullWidth variant="filled" >

                <Box display="flex" alignItems="center" flexWrap="wrap">

                    {
                        participants.map(item =>
                            <Chip
                                className={classes.chip}
                                key={item.id}
                                label={item.name}
                                onDelete={() => removeUser(item)}
                            />
                        )
                    }
                </Box>


                <TextField
                    variant="filled"
                    fullWidth
                    label="Agregar"
                    type="text"
                    name="usuarios"
                    onChange={e => filterUsers(e.target.value)}
                    onClick={() => setOpen(true)}

                />


                <Box p={2} display="flex" flexDirection="column" flexWrap="wrap" >


                    {
                        open && <List>{
                            searchable.map(item =>
                                <ListItem button onClick={() => handleAdd(item)}>
                                    <Typography variant="h6">
                                        {item.name}
                                    </Typography>
                                </ListItem>
                            )
                        }
                        </List>
                    }




                </Box>

            </FormControl>
        </>

    )
}

export default FilterUsers;

const useStyles = makeStyles((theme) => ({
    chip: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }
}));
