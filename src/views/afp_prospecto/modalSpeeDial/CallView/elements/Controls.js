import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import { BottomNavigationAction, Icon, IconButton } from '@material-ui/core';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AjustesAside from './AjustesAside';
import ScreenShareOutlinedIcon from '@material-ui/icons/ScreenShareOutlined';
import StopScreenShareOutlinedIcon from '@material-ui/icons/StopScreenShareOutlined';

import DialpadIcon from '@material-ui/icons/Dialpad';
import HeadsetMicOutlinedIcon from '@material-ui/icons/HeadsetMicOutlined';
import { Settings as SettingsIcon } from 'react-feather'

const useStyles = makeStyles({
    root: {
        width: '100vw',
        position: 'absolute',
        bottom: 0
    },
});



export default function Controls({
    children,
    settingsCb

}) {
    const classes = useStyles();
    const [togglePhone, setTogglePhone] = React.useState(0);


    const slidersCb = () => {
        // alert('sliders')
    }

    return (
        <BottomNavigation>



            <BottomNavigationAction
                disableRipple
                disabled={false}
                onClick={() => { }}
                label="Teclado"
                showLabel={true}
                icon={
                    <IconButton>
                        <DialpadIcon />
                    </IconButton>
                }
            />


            <BottomNavigationAction
                disableRipple
                disabled={false}
                onClick={settingsCb}
                label="Ajustes"
                showLabel={true}
                icon={
                    <IconButton>
                        <SettingsIcon />
                    </IconButton>
                }
            />
        </BottomNavigation>
    );
}
