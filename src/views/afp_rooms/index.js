import React, { useRef, useState, useEffect } from 'react'
import { Grid, makeStyles } from '@material-ui/core';
import { useParams } from 'react-router';
import RoomsLayout from './RoomsLayout';
import _ from 'lodash';
import RoomsGateway from './RoomsGateway';
import JSONTree from 'react-json-tree';
import DebugDialog from './DebugDialog';
import { useSnackbar } from 'notistack';
import { getSala } from 'src/slices/sala';

import { useDispatch, useSelector } from 'src/store';




const RoomsView = () => {

    const { roomName, userName } = useParams();

    const [rolStatus, setRolStatus] = useState(false);



    const [streamLocal, setStreamLocal] = useState({
        nameUserJoin: userName,
        view: false,
        viewVideo: true,
        refStream: useRef(null)
    });
    const [streamArr, setStreamArr] = useState([]);





    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getSala(enqueueSnackbar, roomName))
    }, [dispatch]);


    const hanldeRolStatus = (payload) => {
        const sala = payload && payload.sala;
        if (sala && sala.users && sala.users.length) {
            const _isParticipant = sala.users.findIndex(x => x.user.usuario === userName);
            !rolStatus &&
                setRolStatus({
                    hostName:sala.host.usuario,
                    isParticipant: _isParticipant != -1 ? true : false,
                    isHost: sala.host.usuario == userName ? true : false,
                });
        }
    }
    const _sala = useSelector(state => state.sala);


    hanldeRolStatus(_sala);




    //STATE


    const refScreenShare = useRef();



    return (
        <>

        

                {
                    rolStatus ? (
                        <RoomsGateway
                            //::  PARTICIPANTS
                            streamArr={streamArr}
                            setStreamArr={setStreamArr}
                            //:: LOCAL
                            streamLocal={streamLocal}
                            setStreamLocal={setStreamLocal}

                            //:: SCREEN SHARE
                            refScreenShare={refScreenShare}
                            //:: SETTINGS
                            roomName={parseInt(roomName)}


                            //:: DECORS 
                            hostName={rolStatus.hostName}
                        />
                    ): <></>
                }

         

            <DebugDialog data={{ 
                
                streamLocal, 
                streamArr,
                refScreenShare,
                rolStatus
            
            
            }} />




        </>
    )
}

export default RoomsView;



