import { Box, Button, Chip, IconButton, makeStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core';

import React, { useState } from 'react'
import styled from 'styled-components'

import { palette } from 'src/theme/index'

import Carousel from "react-multi-carousel";
import _ from 'lodash';
import { MEDIA_SCREENS } from 'src/theme/customBreakpoints'
import { X } from 'react-feather';

const RenderVideo = ({ muted, stream, hide }) => {

    return (
        <video
            ref={stream}
            style={{
                width: '100%',
                height: '100%',
                visibility: hide ? 'hidden' : '',
                borderRadius: '12pt'
            }}

            muted={muted && true}
            autoPlay loop playsInline

        >
            <source type="video/mp4" />

        </video>
    )
}





const RoomsLayout = ({
    //::DECORATORS
    hostName,
    isSharing,

    streamArr,
    streamLocal,

    controls,

    refScreenShare,
    userSharing,
    clickUnPublish
}) => {



    const RenderControls = () => {
        return controls;
    }

    const _streamArr = [...streamArr];

    console.log(refScreenShare)

    const [hideHostName, setHideHostName] = useState(false)

    return (
        <View>

            <HostView >
                <Role>
                    <Chip color="secondary" label={hostName} onDelete={() => setHideHostName(true)} style={{ visibility: hideHostName ? 'hidden' : '' }} />
                </Role>


                <SharingItem key='sharing' >
                    {
                        <RenderVideo stream={refScreenShare} key="sharing" hide={userSharing} />
                    }
                    {
                        userSharing &&
                        <RectView center>
                            <Rec isSharing={true} />
                            <p>Usted esta compartiendo su pantalla</p>
                        </RectView>

                    }


                </SharingItem>

                <RectView onClick={clickUnPublish}>
                    {



                        !userSharing && !isSharing &&

                        <>
                            <Rec isSharing={isSharing} />
                            <p>Nadie esta compartiendo su pantalla</p>

                        </>


                    }



                    {
                        userSharing &&

                        <Button variant="outlined" style={{ color: 'white', border: '1px solid #ffffff', margin: '.9em', padding: '.6em' }}>
                            DEJAR DE COMPARTIR PANTTALLA
                        </Button>

                    }

                    {
                        !userSharing && isSharing && <></>
                    }
                </RectView>

            </HostView>

            <GuestsView>
                <GuestItem id={'LOCAL_' + streamLocal.nameUserJoin}>
                    <RenderVideo stream={streamLocal.refStream} muted />
                    <h1> {streamLocal.nameUserJoin} (YO)</h1>
                </GuestItem>
                {
                    _streamArr.sort(function (a, b) {
                        return b.nameUserJoin - a.nameUserJoin;
                    }).map(item => {
                        if (item.nameUserJoin !== false) {
                            return (
                                <GuestItem key={item.nameUserJoin} id={'REMOTE_' + item.nameUserJoin}>
                                    <RenderVideo stream={item.refStream} />
                                    <h1>
                                        {item.nameUserJoin}
                                    </h1>
                                </GuestItem>

                            )
                        }
                    })
                }
                <RenderControls />



            </GuestsView>

        </View >
    )
}

// nameUserJoin: false,
// viewRemoto: false,
// viewRemoteVideo: true,
// refStream: null

export default RoomsLayout;


const SharingImage = styled.img`
    height:100%;
    object-fit:cover;
    position:absolute;
`


const RectView = styled.div`
    bottom:${props => props.center ? '20vh' : 0};    



    :hover{
        box-shadow: 8px 28px 50px rgba(39,44,49,.07), 1px 6px 12px rgba(39,44,49,.04);
        transition: all .4s ease; 
        cursor: pointer;        
    };
    display:flex;
    align-items:center;
    position:absolute;
    z-index:3;
    width:100%;
    justify-content:center;
    p{
        color:#ffffff;
        font-weight:500;
    }

`



const Rec = styled.div`
	width: 12px;
	height: 12px;
	font-size: 0;
	background-color: #DB1F48;
	border: 0;
	border-radius: 35px;
	margin: 18px;
	outline: none;


    animation-name: ${props => props.isSharing ? 'pulse' : ''};
	animation-duration: 1.5s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;

    @keyframes pulse{
	0%{
		box-shadow: 0px 0px 5px 0px rgba(173,0,0,.3);
	}
	65%{
		box-shadow: 0px 0px 5px 13px rgba(173,0,0,.3);
	}
	90%{
		box-shadow: 0px 0px 5px 13px rgba(173,0,0,0);
	}
}

`

const Role = styled.div`
    position:absolute;
    top:.9em;
    z-index:2;
    width:100%;
    display:flex;
    justify-content:center;


    h1{    
        background-color:${palette.bgs.babyPower};
        border-radius:9pt;
        padding:.45em;
        font-size:1.2em;
        box-shadow: 0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(0, 0, 0, 0.9) ;

    }    


`


const View = styled.div`
        font-family: Arial, Helvetica, sans-serif;
    position:relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow:hidden;
    max-width:100vw;

    height:100vh;
    max-height:100vh;
`;

const HostView = styled.div`
    position:relative;
    background-color: #1a1b24;
    height:40vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
`;




const GuestsView = styled.div`
    max-height:60vh;
    position:relative;
    overflow-y: scroll;
    display: grid;
    padding-top:.3em;
    grid-gap: .3em;
  

    @media only screen and (min-width: ${MEDIA_SCREENS.XS.FROM}px) and (max-width: ${MEDIA_SCREENS.XS.TO}px)  {
        grid-template-columns: repeat(2, 1fr);
    }
    @media only screen and (min-width: ${MEDIA_SCREENS.SMALL.FROM}px) and (max-width: ${MEDIA_SCREENS.SMALL.TO}px)  {
        grid-template-columns: repeat(3, 1fr);
    }
    @media only screen and (min-width: ${MEDIA_SCREENS.MEDIUM.FROM}px)   {
        grid-template-columns: repeat(4, 1fr);
    }  
`

const GuestItem = styled.div`
    margin-bottom:.3em;
    border-radius:12pt;
    background-color:${palette.bgs.azn_dark};
    /* height:12em; */
    position:relative;
    display: flex;
    max-width:120em;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.05);   
    transition-duration: 172ms;
    will-change: transform, box-shadow;
    transition: .4s ease-in-out;  
    :hover{
        box-shadow: 8px 28px 50px rgba(39,44,49,.07), 1px 6px 12px rgba(39,44,49,.04);
        transition: all .4s ease; 
        cursor: pointer;        
    };

    h1{
        margin:1.2em;
        top:0;
        position:absolute;
        color:${palette.primary.contrastText};
        font-size:1.2em;
        font-family: Arial, Helvetica, sans-serif;
    }
    
`;







const SharingItem = styled.div`
    height:40vh;
    display:flex;
    justify-content:center;
`;
