import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    SpaceMensaje1: {
        marginBottom: '1.5em',
        backgroundColor: '#F4F6F8',
    },
    SpaceMensaje2: {
        marginTop: '1.5em',
        backgroundColor: '#F4F6F8',
    },
    separateButtonTP: {
        marginTop: '.5em',
        marginBottom: '1em',
    },
    ColorButtonOnSelect: {
        backgroundColor: '#3D4852',
        color: '#ffffff',
        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    },
    ColorButtonOffSelect: {
        backgroundColor: '#ffffff',
        color: '#3D4852',
        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    },
    ButtonBlack: {
        backgroundColor: '#000000',
        color: '#ffffff',
        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    },
}));

export default useStyles;