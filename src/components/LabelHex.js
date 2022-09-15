import { makeStyles } from '@material-ui/core';
import React from 'react'
import { typeToColor } from 'src/utils/filehelpers';



const useStyles = makeStyles((theme) => ({
    root: {
        fontFamily: theme.typography.fontFamily,
        alignItems: 'center',
        borderRadius: 2,
        display: 'inline-flex',
        flexGrow: 0,
        whiteSpace: 'nowrap',
        cursor: 'default',
        flexShrink: 0,
        fontSize: theme.typography.pxToRem(12),
        fontWeight: theme.typography.fontWeightMedium,
        height: 20,
        justifyContent: 'center',
        letterSpacing: 0.5,
        minWidth: 20,
        padding: theme.spacing(0.5, 1),
        textTransform: 'uppercase',
        color:'#ffffff'
    },

}));


const LabelHex = ({ children, color }) => {

    const classes = useStyles();
    return (
        <span style={{ backgroundColor: color }} className={classes.root}>
            {children}
        </span>
    )
}

export default LabelHex
