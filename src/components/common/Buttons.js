import React from 'react';
import { createMuiTheme, withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';

const ColorButton = withStyles((theme) => ({
  root: {
    color: "#ffffff",
    backgroundColor: "#FA3E3E",
    '&:hover': {
      backgroundColor: "#FA3E3E"
    },
  },
}))(Button);



export default function Buttons({onClick, disabled, children, startIcon, className, size, endIcon}) {

  return (
      <ColorButton 
      size={size}

      startIcon={startIcon?startIcon:null}
      endIcon={endIcon?endIcon:null}

      disabled={disabled}
      onClick={onClick}
      variant="contained" color="primary" className={className}>
        {
          children
        }
      </ColorButton>      
  );
}