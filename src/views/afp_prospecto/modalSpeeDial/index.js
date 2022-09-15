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
import CallView from './CallView';






{/* import { DoneAll, EditRounded, PhoneRounded, VerifiedUser } from '@material-ui/icons'; */ }


export default function ModalSpeedDial({
  setSpeedDial,
  speedDial,
  prospectoId
}) {


  const [phoneNumber, setPhoneNumber]= useState("0958989804")


  return (



    <Dialog open={speedDial}
      onClose={() => setSpeedDial(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      prospectoId={prospectoId}
    >

      <CallView
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        payload={{}}
        setPayload={()=>{}}
      />




    </Dialog>

  );
}




