import { Box, Button, Chip, IconButton, makeStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core';

import React, { useState } from 'react'
import styled from 'styled-components'

import { palette } from 'src/theme/index'

import Carousel from "react-multi-carousel";
import _, { forEach } from 'lodash';
import { MEDIA_SCREENS } from 'src/theme/customBreakpoints'
import { X } from 'react-feather';
import JSONTree from 'react-json-tree';

const RenderVideo = ({ muted, stream, hide }) => {

    return (
        <video
            ref={stream}
            style={{
                width: '100%',
                height: '100%',
                display: hide ? 'none' : '',
                borderRadius: '12pt'
            }}

            muted={muted && 'muted'}
            autoPlay loop playsInline

        >
            <source type="video/mp4" />

        </video>
    )
}


const DecorarStream = (streaming, userList, coreSala, authUser) => {

    const host = coreSala.host.usuario;
    const hostName = coreSala.host.name;

    const users = userList.map(item => {
        return {
            usuario: item.user.usuario,
            name: item.user.name
        }
    });


    const preDecore = streaming.map(item => {
        const current = item.nameUserJoin;
        const _current = users.find(element => element.usuario == current);
        const _currentName = _current && _current.name ? _current.name : false; return {
            ...item,
            name: item.name ? item.name : _currentName
        };
    });

    const preDecore2 = preDecore.map(item => {
        const isHost = item.nameUserJoin === host;
        return {
            ...item,
            name: isHost ? hostName : item.name,
            isHost: isHost
        }
    })

    const decored = preDecore2.map(item => {
        const isMe = item.nameUserJoin === authUser.usuario;
        return {
            ...item,

            isMe: isMe
        }
    })



    const equipoStream = decored.filter(element => element.isHost == false);


    const hostStream = decored.find(element => element.isHost);



    return {
        streaming, users, host,

        decored,
        equipoStream,
        hostStream

    }
};




const RoomsLayout = ({

    isSharing,

    streamArr,
    streamLocal,

    controls,

    refScreenShare,
    userSharing,
    clickUnPublish,

    //::DECORS
    authUser,
    roomDescripcion,
    isHost,
    userList,
    coreSala
}) => {

    const [hideHostName, setHideHostName] = useState(false)


    const RenderControls = () => controls;

    const streaming = [...streamArr, streamLocal];

    const _streaming = DecorarStream(streaming, userList, coreSala, authUser);

    return (
        <>

            <View>

                <HostView >
                    <Role><Chip color="secondary" label={roomDescripcion} onDelete={() => setHideHostName(true)} style={{ visibility: hideHostName ? 'hidden' : '' }} /></Role>

                    <SharingItem key='sharing' >
                        {
                            <RenderVideo stream={refScreenShare} key="sharing" hide={!isSharing} />
                        }
                        {
                            _streaming.hostStream &&
                            <RenderVideo stream={_streaming.hostStream.refStream} key="host" hide={isSharing} muted={_streaming.hostStream.isMe} />
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

                    {
                        _streaming.equipoStream.map(item => (
                            <GuestItem key={item.nameUserJoin} id={'REMOTE_' + item.nameUserJoin} key={'REMOTE_' + item.nameUserJoin} style={{ visibility: (item.viewRemoteVideo || item.viewVideo) ? '' : 'hidden' }}>
                                <RenderVideo stream={item.refStream} muted={item.isMe} />
                                {/* <h3> {item.name} </h3> */}
                                <h3> {item.isMe && 'IS_ME'} </h3>

                            </GuestItem>

                        ))
                    }
                    <RenderControls />



                </GuestsView>

            </View >

        </>
    )
}


export default React.memo(RoomsLayout);




const MyName = styled.div`
    position:fixed;
    bottom:0;
    right:0;

    h1 {
        font-size:1.2em;
        padding:.9em;
        
    }
`


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
    height:60vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
`;




const GuestsView = styled.div`
    /* height:60vh; */

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

    h3{
        margin:.9em;
        top:0;
        position:absolute;
        color:${palette.primary.contrastText};
        font-size:.81em;
        font-family: Arial, Helvetica, sans-serif;
    }
    
`;







const SharingItem = styled.div`
    height:60vh;
    display:flex;
    justify-content:center;
`;
