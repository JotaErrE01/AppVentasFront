import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import styled from 'styled-components';
import {
    List, ListItem, ListItemIcon, ListItemText, withStyles, makeStyles, DialogTitle,
    DialogContentText, DialogContent, DialogActions, Typography
} from '@material-ui/core';
import { DoneAll, EditRounded, PhoneEnabledRounded, PhoneRounded, VerifiedUser } from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import JSONTree from 'react-json-tree';






{/* import { DoneAll, EditRounded, PhoneRounded, VerifiedUser } from '@material-ui/icons'; */ }


export default function ModalEmbudo({
    open,
    setOpen,
    handleEmbudo,
    grabArr
}) {




    return (



        <Dialog open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >

            <DialogTitle id="simple-dialog-title">
                Procesar contactos
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    ¿Está seguro de ingresar {grabArr.length} elementos al embudo de ventas?
                </DialogContentText>
            </DialogContent>


            <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
                    Cancelar
                </Button>
                <Button onClick={()=>handleEmbudo(grabArr)} color="primary" autoFocus>
                    Continuar
                </Button>
            </DialogActions>




        </Dialog>

    );
}




