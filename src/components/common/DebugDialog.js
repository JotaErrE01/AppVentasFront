import React, { useState } from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import BugReportRoundedIcon from '@material-ui/icons/BugReportRounded';
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    floatButton: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 99999,
        cursor: 'pointer',
        margin: '.6em'
    }
}));
const DebugDialog = ({ children, data }) => {
    const [debug, setDebugg] = useState(false);

    const classes = useStyles();


    return (
        <>

            <IconButton onClick={() => { setDebugg(!debug) }} className={classes.floatButton}>
                <BugReportRoundedIcon />
            </IconButton>

            {/* <Draggable> */}
                {/* <DebugView hide={!debug}>
                    <div className="content">
                        <JSONTree data={data} />
                    </div>
                </DebugView> */}
            {/* </Draggable> */}


        </>

    )
}

export default DebugDialog


const DebugView = styled.div`
    display:${props => props.hide ? 'none' : 'block'};
    width: 100%;
    background-color: #232f3e;
    /* position:fixed ; */

    z-index:3 ;
    border-radius: 9pt;
    li {
        background-color: #232f3e;

    }
    overflow: hidden;
    /* overflow-y:scroll; */

    bottom:3em;
    left:3em;

    .content{
        overflow-y:scroll;
        height: 30vh;
        padding: 1em;

        ::-webkit-scrollbar {
            width: 18px;
        }
        ::-webkit-scrollbar-track {
            background-color: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #d6dee1;
            border-radius: 20px;
            border: 6px solid transparent;
            background-clip: content-box;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: #a8bbbf;
        }
    }

`