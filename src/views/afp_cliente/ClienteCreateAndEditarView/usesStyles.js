import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    separate: {
        marginTop: '1.5em'
    },
    separateButton: {
        marginTop: '1.5em',
        paddingLeft: '1.5em',
        paddingRight: '1.5em',
    },
    separateButtonAE: {
        marginTop: '.5em',
        paddingLeft: '1em',
        paddingRight: '1em',
    },
    ButtonBlack: {
        backgroundColor: '#000000',
        color: '#ffffff',
        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    },
    LabelGender: {
        marginTop: '1.5em',
        marginRight: '1.5em',
    },
    SpaceRadio: {
        paddingLeft: '2em',
    },
    separateNacionalidad: {
        marginTop: '.5em'
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
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    separateButton: {
        marginTop: '1.5em',
        paddingLeft: '1.5em',
        paddingRight: '1.5em',
    },
    separateButtonActividad: {
        marginTop: '.5em',
        paddingLeft: '1.5em',
        paddingRight: '1.5em',
    },
    ButtonWhite: {
        backgroundColor: '#ffffff',
        color: '#000000',
        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    },
    SeparateText: {
        paddingTop: '.5em',
    },
    SeparateButtons: {
        paddingTop: '.8em',
    },
    ButtonRadio: {
        width: '200px',
        height: '50px',
        transition: 'all 250ms ease',
        willChange: 'transition',
        display: 'inline-block',
        textAlign: 'center',
        cursor: 'pointer',
        position: 'relative',
        fontWeight: '900',
        /* &:active {
            transform: 'translateY(50px)',
        } */
    },
    FlexBetween: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
        fontSize: '20px'
    },
    buttonUpdate: {
        marginRight: '15px',
        fontSize: '13px'
    }
}));

export default useStyles;