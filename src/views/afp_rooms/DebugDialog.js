import React, { useState } from 'react';
import { Button, DialogActions, DialogTitle, Grid, DialogContent, Dialog, IconButton , makeStyles} from '@material-ui/core';
import BugReportRoundedIcon from '@material-ui/icons/BugReportRounded';
import JSONTree from 'react-json-tree';

import { X } from 'react-feather';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    floatButton: {
        position:'absolute',
        top:0,
        right:0,
        zIndex:99999
    }
}));
const DebugDialog = ({children, data}) => {
    const [debug, setDebugg] = useState(false);

    const classes = useStyles();

    
    return (
        <>

        <IconButton onClick={()=>{setDebugg(!debug)}} className={classes.floatButton}>
            <BugReportRoundedIcon/>
        </IconButton>

            <Dialog open={debug} onClose={() => setDebugg(false)}>
                <DialogTitle>

                    Debugg

                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => setDebugg(false)}>
                        <X />
                    </IconButton>

                </DialogTitle>
                <DialogContent>
                </DialogContent>


                

            </Dialog>


        </>
      
    )
}

export default DebugDialog
const theme = {
    scheme: 'monokai',
    base00: '#0C0C0C',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0D: '#3A96DD',
    base0B: '#13A10E',
    base0C: '#a1efe4',
    base0E: '#ae81ff',
    base0F: '#cc6633',
};